var fs = require('fs');
var gulp = require('gulp');
var axios = require('axios');
var _ = require('underscore');
var tar = require('gulp-tar');
var dateFns = require('date-fns');
var urllib = require('urllib');
var gzip = require('gulp-gzip');
var shell = require('gulp-shell');

var packageInfo = require('./package.json');
var name = packageInfo.name;
var version = packageInfo.version;

// region variable
const argv = require('minimist')(process.argv.slice(2))
  , suffix = argv.suffix || ''
  , suffixes = _.isArray(suffix) ? suffix : [suffix]
  , notificationUrl = argv.notification
  , commitid = (argv.commitid || '').substr(0, 8)
  , localBranchName = (argv.branchName || '').replace(/^remotes\//g, '').replace(/^origin\//g, '')
  , branch = localBranchName.replace(/\//g, '-')
  , branchNames = branch.split('-')
  , filenameArray = [name, version].concat(branch).concat(suffixes).concat(commitid)
  , filename = `${_.filter(filenameArray, v => v).join('-')}.tar`
  , clearFn = shell.task('rm -rf dist/', { cwd: __dirname })
  , isProduction = process.env.NODE_ENV === 'production'
  , site = argv.site || 'store.helianshare.com'
  , uploadUrl = `http://${site}/repository/nas/${name}/${filename}.gz`
  , getCurrentTime = () => dateFns.addHours(dateFns.getTime(new Date().toISOString()), 8);

const packCommand = `npx \
  webpack \
  --hide-modules \
  --config ./config/webpack.config${isProduction ? '.prod' : '.dev'}.js \
`;

const successMsg = `### 自动打包成功

下载地址：[点我下载](${uploadUrl})

项目名称：${name || '--'}

版本信息：${version || '--'}

所属分支：${localBranchName || '--'}

提交号码：${commitid || '--'}

打包时间：${dateFns.format(getCurrentTime(), 'YYYY-MM-DD HH:mm:ss')}

自动部署：[点我部署](http://t.helianshare.com:8006/?url=${encodeURIComponent(uploadUrl)})`;

const getNotifyObject = v => ({
  msgtype: 'markdown',
  markdown: `${JSON.stringify({
    title: `打包结果：${name}`,
    text: v,
  }, null, 2)}`,
  at: {
    atMobiles: [],
    isAtAll: false,
  },
});

const sendError = (error, cb) => {
  const currentTime = dateFns.format(getCurrentTime(), 'YYYY-MM-DD HH:mm:ss');
  const errorMsg = `### 自动打包失败

查看详情：[${name || '--'}](http://git.helianshare.com/fed/${name}/pipelines)

项目名称：${name || '--'}

版本信息：${version || '--'}

所属分支：${localBranchName || '--'}

提交号码：${commitid || '--'}

打包时间：${currentTime}`;

  axios.post(
    notificationUrl,
    getNotifyObject(errorMsg),
  ).then(v => cb(error), e => cb(e));
}
// endregion

gulp.task('clear', clearFn);

gulp.task('pack', ['clear'], shell.task(packCommand, { cwd: __dirname }));

gulp.task('zip', ['pack'], () => gulp.src('dist/**/*')
  .pipe(tar(filename))
  .pipe(gzip())
  .pipe(gulp.dest('dist')));

gulp.task('upload', ['zip'], cb => fs.readFile(
  `./dist/${filename}.gz`,
  (err, data) => err ? sendError(err, cb) : urllib.request(uploadUrl, {
    method: 'PUT',
    auth: 'admin:admin123',
    content: data,
    timeout: [30000, 50000],
  }, (err, data, res) => {
    if (err) {
      cb(err);
    } else if (res.statusCode >= 300 || res.statusCode < 200) {
      sendError(new Error(`Upload Error: ${res.statusCode}`), cb);
    } else {
      const notifyObject = getNotifyObject(successMsg);
      axios.post(notificationUrl, notifyObject).then(v => cb(), e => cb(e));
    }
  }),
));

gulp.task('default', ['clear', 'upload'], clearFn);
