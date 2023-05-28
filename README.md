# program-think-chrome-repair

这是一个chrome浏览器插件，用于修复[编程随想](https://program-think.blogspot.com)博客评论区加载出错的问题，火狐插件参考此[修复仓库](https://github.com/learnthink/blog_repair)，如果你使用油猴，也可以翻到下面的油猴教程

## 使用本插件
1. 下载解压本文件夹
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/5f9a3d08-d2c0-4290-9392-ffcb2a796e64)
2. 点击chrome右上角三个点打开更多工具 -> 扩展程序
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/53f45ac7-8f8d-4254-ba8c-0a4694b5cd6c)
3. 打开扩展程序右上角开发者模式
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/632f9b74-3ed6-4497-8968-7264a9fa559f)
4. 点击加载已解压的扩展程序，选择解压后的文件夹，或将解压后的文件夹拖入扩展程序页面
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/831fd347-ff3e-4138-989a-701f42083054)
5. 可以打开或者留言编程随想博客评论区
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/4e9d2a9f-e161-455f-a962-d2593f2b6008)

## 使用油猴脚本
1. 打开 [chrome应用商店](https://chrome.google.com/webstore/search/tampermonkey?hl=zh-CN) 搜索 tampermonkey
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/3df3bd9f-5e04-46f8-8e6c-23429fabfe13)
2. 点击添加至chrome
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/f3cc988e-e9b2-40a9-b97b-d200213db467)
3. 打开此脚本地址点击安装此脚本 https://greasyfork.org/zh-CN/scripts/450470-%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%E7%9A%84%E5%8D%9A%E5%AE%A2%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%AE%E5%A4%8D/code
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/7f6b6d7d-6181-4b8d-8f61-88cc55789feb)
![image](https://github.com/chonglang-TV/program-think-chrome-repair/assets/109212755/b09c2e41-c0b7-44f8-8b63-a8cb0c6f01d4)
4. 安装后刷新博客页面同样可以打开评论区

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

