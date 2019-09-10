# gulp-url2relative

主要是为gulp打包时替换路径服务    

html文件里面的js/css/images等静态文件，css里面的img/font路径，把里面的链接替换为相对链接  

## 替换原理
针对当前文件的路径和静态文件使用的路径进行对比而生成相对链接
比如代码都是在src目录下，在处理src/css/main.css文件时，当前main.css文件的路径是/src/css，而里面有个背景图片的路径是/src/assets/images/1.jpg;那么2者比较，会替换为../assets/images/1.jpg。  
一般，无论是html文件还是css文件，里面用到的静态资源我们都不会用完整的链接，而是基于某个变量下。比如上面案例，一般我们会@@imgSrc/assets/images/1.jpg这种，所以使用时，我们需要传入@@imgSrc的路径去替换为真正的路径后再去比较。


### 具体使用
安装：  
npm install @mhao/gulp-url2relative --save-dev  

gulpfile.js配置文件引入该插件：  
var url2relative = require('@mhao/gulp-url2relative');  

使用插件：  
gulp.src(...).pipe(url2relative(options))  
options为传入的参数，为对象类型  

具体参数：  
options  Object  
options.isLink Boolean  
  为true时，直接替换变量而不是转为相对链接  
options.prefix String  
  变量的识别根据这个来判断，比如变量为@@imgPath;那么这里值为@@，默认也为@@  
options.suffix String  
  根据这个识别哪种类型的静态资源需要替换，默认几乎所有图片、字体、js、css都会替换  
 options.data Object  
  传入的变量，如{imgPath: path.resolve(__dirname, "./src/assets/css")}，可以多个，如cssPath、htmlPath等  



