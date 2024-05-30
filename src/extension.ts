import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("vw2px.convert", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("没有可用的编辑器");
      return;
    }

    const config = vscode.workspace.getConfiguration("vw2px");
    const designWidth = config.get<number>("designWidth", 1440);

    const selection = editor.selection;
    let text: string;
    if (selection.isEmpty) {
      text = editor.document.getText();
    } else {
      text = editor.document.getText(selection);
    }

    const regex = /(\d+(\.\d+)?)vw/g;
    const convertedText = text.replace(regex, (match, p1) => {
      const vwValue = parseFloat(p1);
      const pxValue = Math.round((vwValue * designWidth) / 100);
      return `${pxValue}px`;
    });

    editor.edit((editBuilder) => {
      if (selection.isEmpty) {
        const firstLine = editor.document.lineAt(0);
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        const textRange = new vscode.Range(
          firstLine.range.start,
          lastLine.range.end
        );
        editBuilder.replace(textRange, convertedText);
      } else {
        editBuilder.replace(selection, convertedText);
      }
    });

    vscode.window.showInformationMessage("转换完成");
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
