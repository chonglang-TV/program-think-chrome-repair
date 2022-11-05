## 描述
这是一个chrome浏览器插件，用于修复[编程随想](https://program-think.blogspot.com)博客评论区加载出错的问题，火狐插件参考此[修复仓库](https://github.com/learnthink/blog_repair)

## 使用
  下载解压本文件夹，点击chrome右上角三个点打开更多工具 -> 扩展程序 -> 打开扩展程序右上角开发者模式 -> 将本文件夹拖入扩展程序页面即可打开编程随想博客评论

## 问题排查
1. f12发现控制台报错信息： NOT found 'postID' in 'm_sEditorUrl' attr!
2. 右键 -> 显示网页源代码 -> Ctrl + f 查找报错信息定位到这里getParam("postID")
```javascript
  var $editor_src = $("a#comment-editor-src");
  $editor_src.length && (m_sEditorUrl = $editor_src.attr("href"));
  assert(m_sEditorUrl, "init: Invalid 'm_sEditorUrl'!");
  (m_sEditorUrl.indexOf("#") == -1) && (m_sEditorUrl += "#");

  m_sPostId = (new Url(m_sEditorUrl)).getParam("postID");
  assert(m_sPostId, "init: NOT found 'postID' in 'm_sEditorUrl' attr!");
```
3. 可以看到m_sEditorUrl是从#comment-editor-src这个元素的href获取的，再查找一下comment-editor-src，发现参数里没有postId，只有po，获取不到所以报错
```
<a href='https://www.blogger.com/comment/frame/5235590154125226279?po=329569519001390000&hl=zh-CN' id='comment-editor-src'></a>
```

## 解决方式
- 考虑页面加载完成后用content_scripts.js直接修改comment-editor-src标签的的href，加载评论正常，但是回复评论因为地址参数中的po改成了postID所以404错误。用了manifest v3的 declarativeNetRequest regexFilter，替换打开链接的postID为po
- 使用[拦截请求](https://github.com/learnthink/blog_repair)的方式，替换getParam("postID")为getParam("po")。但是由于chrome扩展限制，不能修改请求的响应体，所以chrome不能使用该方法。

