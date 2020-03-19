const moduleVisitor = isModule => ({
  // TODO: Should we check commonjs as well?
  ImportDeclaration(nodePath) {
    // TODO: Do we need that for polyfills?
    const {specifiers} = nodePath.node;
    if (specifiers.length !== 0) isModule.value = true;
  },
  ExportDefaultDeclaration() {
    isModule.value = true;
  },
  ExportNamedDeclaration() {
    isModule.value = true;
  },
  ExportAllDeclaration() {
    isModule.value = true;
  }
});

const assignToWindow = (t, id) => t.expressionStatement(
  t.assignmentExpression(
    '=',
    t.memberExpression(t.identifier('window'), id),
    id
  )
)

module.exports = function({ types: t }) {
  const isModule = {value: false};
  let programPath = null;
  return {
    visitor: {
      Program(nodePath) {
        programPath = nodePath;
        isModule.value = false;
        nodePath.traverse(moduleVisitor(isModule));
      },
      VariableDeclaration(nodePath) {
        const {kind, declarations} = nodePath.node;
        if (kind !== 'var') return;
        const [declaration] = declarations;
        const binding = programPath.scope.bindings[declaration.id.name];
        if (isModule.value || !binding || binding.path.node != declaration) return;
        for (const {id} of declarations) {
          programPath.node.body.push(assignToWindow(t, id));
        }
      },
      FunctionDeclaration(nodePath) {
        const { id } = nodePath.node;
        const binding = programPath.scope.bindings[id.name];
        if (isModule.value || !binding || binding.path !== nodePath) return;
        programPath.node.body.push(assignToWindow(t, id));
      }
    }
  };
};
