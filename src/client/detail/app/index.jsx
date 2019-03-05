import { Component } from 'preact';
import classnames from 'classnames';
import 'jquery.easing';

function map(data, fn) {
  const list = [];
  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    list.push(fn(item, index));
  }
  return list;
}

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      // 初始值
      curBigPhoto: 0,
      isShowBig: false,
      isSlider: false,
      curPage: 'case',
      photo: [],
      info: [],
      video: [],
      doctor: {},
    };
  }
  componentWillMount() {
    this.getInfo(this.getUrlParam('id'));
  }
  getUrlParam(name) {
    if (name) {
      var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r !== null) return decodeURI(r[2]);
      return null; //返回参数值
    } else {
      var url = location.search; //获取url中'?'符后的字串
      var theRequest = new Object();
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1);
        if (str.indexOf('&') !== -1) {
          var strs = str.split('&');
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
          }
        } else {
          theRequest[str.split('=')[0]] = decodeURI(str.split('=')[1]);
        }
      }
      return theRequest;
    }
  }
  clickHandler(type) {
    this.setState({ curPage: type });
  }

  hideBigPhoto() {
    this.setState({ isShowBig: false });
  }
  enlargeImage(i) {
    this.setState({ curBigPhoto: i, isShowBig: true }, () => {
      $('.img-box').css({ opacity: '0' });
      $($('.img-box')[i])
        .stop('show', true, true)
        .animate({ opacity: '1' }, {
          duration: 1800,
          queue: 'show',
          easing: 'easeOutQuart',
        })
        .dequeue('show');
    });
  }
  changeBigPhote(type) {
    if (this.state.isSlider) return false;
    if (type === 'prev') {
      if (this.state.curBigPhoto <= 0) {
        return false;
      }
      this.state.isSlider = true;
      this.setState({ curBigPhoto: this.state.curBigPhoto - 1 }, () => {
        this.sliderPhoto('prev', this.state.curBigPhoto + 1, this.state.curBigPhoto);
      });
    } else {
      if (this.state.curBigPhoto >= 8) {
        return false;
      }
      this.state.isSlider = true;
      this.setState({ curBigPhoto: this.state.curBigPhoto + 1 }, () => {
        this.sliderPhoto('next', this.state.curBigPhoto - 1, this.state.curBigPhoto);
      });
    }
  }
  sliderPhoto(type, prev, next) {
    if (type === 'next') {
      $($('.img-box')[next])
        .stop('next', true, true)
        .css({ marginLeft: '5rem', opacity: '0' })
        .animate({ margin: '0', opacity: '1' }, {
          duration: 1800,
          queue: 'next',
          easing: 'easeOutQuart',
        })
        .dequeue('next');
      $($('.img-box')[prev])
        .stop('prev', true, true)
        .css({ margin: '0' })
        .animate({ marginLeft: '-5rem', opacity: '0' }, {
          duration: 1800,
          queue: 'prev',
          easing: 'easeOutQuart',
          complete: () => {
            this.state.isSlider = false;
          },
        })
        .dequeue('prev');
    } else {
      $($('.img-box')[next])
        .stop('next', true, true)
        .css({ marginLeft: '-5rem', opacity: '0' })
        .animate({ margin: '0', opacity: '1' }, {
          duration: 1800,
          queue: 'next',
          easing: 'easeOutQuart',
        })
        .dequeue('next');
      $($('.img-box')[prev])
        .stop('prev', true, true)
        .css({ margin: '0' })
        .animate({ marginLeft: '5rem', opacity: '0' }, {
          duration: 1800,
          queue: 'prev',
          easing: 'easeOutQuart',
          complete: () => {
            this.state.isSlider = false;
          },
        })
        .dequeue('prev');
    }
  }
  renderPhoto() {
    return (
      <div className="photo-box">
        {
          map(this.state.photo, (v, i) => {
            return (
              <div>
                <div className="scaleImg" onMouseEnter={this.scaleImage.bind(this, i)}
                  onMouseOut={this.scaleImagehh.bind(this, i)} onClick={this.enlargeImage.bind(this, i)}>
                  <img src={v.url} alt="" className={classnames({ imgH: parseInt(v.height) < parseInt(v.width) })} />
                  {v.taggingUrl && <img src={v.taggingUrl} className={classnames({ imgH: parseInt(v.height) < parseInt(v.width), annotation: true })} alt="" />}
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
  renderInfo() {
    return (
      <div className="info-box" dangerouslySetInnerHTML={{ __html: this.state.info }}></div>
    );
  }
  renderBigPhoto() {
    return (
      <div className="big-photo">
        <div className="slider-box">
          <div className="all-img-box">
            {this.state.photo.map(v =>
              <div className="img-box">
                <img src={v.url} />
                {v.taggingUrl && <img src={v.taggingUrl} className="annotation" alt="" />}
                <div className="case-info">病例分析：{this.state.photo.caseDesc}</div>
              </div>)}
          </div>
          <div onClick={this.changeBigPhote.bind(this, 'prev')} className="btn left-btn iconfont">&#xe624;</div>
          <div onClick={this.changeBigPhote.bind(this, 'next')} className="btn right-btn iconfont">&#xe625;</div>
        </div>
        <span className="iconfont close" onClick={this.hideBigPhoto.bind(this)}>&#xe63f;</span>
      </div>
    );
  }
  renderVideo() {
    return (
      <div className="video-box">
        <div className="img-box1">
          <video className="vid1"
            preload="none"
            controls="controls"
            controlsList="nodownload"
            poster={this.state.video.coverurl}
            src={this.state.video.playurl}>
          </video>
        </div>
        <div className="video-info">专家分享：{this.state.video.title}</div>
      </div>
    );
  }
  getInfo(id) {
    $.ajax({
      url: '/api/crm/home/listContent',
      beforeSend: (request) => {
        request.setRequestHeader('regUserId', id);
      },
      dataType: 'json',
      type: 'get',
      data: {
        page: 1,
        limit: 1,
      },
      timeout: 5000,
      cache: false,
      success: ({ result }) => {
        this.setState({
          photo: result.photoList[0].photos,
          info: result.infoList[0].content,
          video: result.vioList[0].aliVoaPlayInfo,
          doctor: {
            avatar: result.infoList[0].hospUser.avatar,
            userName: result.infoList[0].hospUser.userName,
            hlDeptName: result.infoList[0].hospUser.hlDeptName,
            stationName: result.infoList[0].hospUser.stationName,
            userPosition: result.infoList[0].hospUser.userPosition,
          },
        });
      },
    });
  }


  scaleImage(i) {
    const queue = 'scaleImg', $target = $('.photo-box .scaleImg').eq(i);
    $target
      .stop(queue, true, false)
      .animate({ width: '2.2rem', height: '2.2rem', left: '-0.1rem', top: '-0.1rem' }, {
        queue,
        duration: 300,
        easing: 'easeOutBounce',
      })
      .dequeue(queue);

  }

  scaleImagehh(i) {
    const queue = 'scaleImg', $target = $('.photo-box .scaleImg').eq(i);
    $target
      .stop(queue, true, false)
      .animate({ width: '2rem', height: '2rem', left: '0rem', top: '0rem' }, {
        queue,
        duration: 300,
        easing: 'easeOutBounce',
      })
      .dequeue(queue);
  }

  render() {
    return (
      <div className="content">
        <div className="center-content">
          <div className="type-box">
            <span onClick={this.clickHandler.bind(this, 'case')} className={classnames({ activity: this.state.curPage === 'case' })} >病例</span>
            <span onClick={this.clickHandler.bind(this, 'info')} className={classnames({ activity: this.state.curPage === 'info' })}>文章</span>
            <span onClick={this.clickHandler.bind(this, 'video')} className={classnames({ activity: this.state.curPage === 'video' })}>视频</span>
          </div>
          {this.state.curPage === 'case' ? this.renderPhoto() : this.state.curPage === 'info' ? this.renderInfo() : this.renderVideo()}
        </div>
        <div className="doc-box">
          <div className="doc-info">
            <div className="name">{this.state.doctor.userName}-{this.state.doctor.userPosition}</div>
            <div>{this.state.doctor.stationName} </div>
            <div>{this.state.doctor.hlDeptName}</div>
          </div>
          <img src={this.state.doctor.avatar} />
        </div>
        {this.state.isShowBig ? this.renderBigPhoto() : ''}
      </div>
    );
  }
}

