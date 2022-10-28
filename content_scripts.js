var modifyEditorUrl = () => {
  var editorUrlDom = document.querySelector('#comment-editor-src')
  if (editorUrlDom && editorUrlDom.href && editorUrlDom.href.indexOf('?po=') > -1 ) {
    editorUrlDom.href = editorUrlDom.href.replace(/\?po=/g, '?postID=')
  }
}
document.addEventListener('DOMContentLoaded', modifyEditorUrl);