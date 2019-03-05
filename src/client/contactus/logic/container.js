import 'jquery.easing';

export default {
  ready() {
    $('.img-bg')
      .stop('right', true, true)
      .css({ bottom: '-0.2rem', opacity: 0 })
      .delay(600, 'right')
      .animate({ bottom: '0', opacity: 1 }, {
        duration: 1000,
        easing: 'easeOutQuart',
        queue: 'right',
      })
      .dequeue('right');
    $('.left-man')
      .stop('left-man', true, true)
      .css({ top: '-0.3rem', opacity: 0 })
      .delay(500, 'left-man')
      .animate({ top: '-0.5rem', opacity: 1 }, {
        duration: 1000,
        easing: 'easeOutQuart',
        queue: 'left-man',
      })
      .dequeue('left-man');
    $('.right-man')
      .stop('right-man', true, true)
      .css({ top: '-0.3rem', opacity: 0 })
      .delay(1000, 'right-man')
      .animate({ top: '-0.5rem', opacity: 1 }, {
        duration: 1000,
        easing: 'easeOutQuart',
        queue: 'right-man',
      })
      .dequeue('right-man');
    $('.talk-img')
      .stop('talk-img', true, true)
      .css({ top: '-1.5rem', opacity: 0 })
      .delay(1500, 'talk-img')
      .animate({ top: '-1rem', opacity: 1 }, {
        duration: 1000,
        easing: 'easeOutElastic',
        queue: 'talk-img',
      })
      .dequeue('talk-img');

    $('.submitInfo').click(() => {
      const userName = $('.userName').val(),
        mobile = $('.mobile').val();
      $('.name-tip,.phone-tip').hide();
      $('.inputbox').removeClass('null-info');
      if (!userName) {
        $('.name-tip').show('fast');
        $('.name-input').addClass('null-info');
        return false;
      }
      if (!mobile) {
        $('.phone-tip').show('fast');
        $('.phone-input').addClass('null-info');
        return false;
      }
      $.ajax({
        url: '/api/crm/home/savePartnerInfo',
        data: {
          name: userName,
          mobile: mobile,
        },
        dataType: 'json',
        type: 'post',
        timeout: 5000,
        cache: false,
        success: function ({ code }) {
          $('.tip').hide();
          if (code === 0) {
            $('.suc-tip').show();
          } else {
            $('.error-tip').show();
          }
        },
      });
    });
  },
};
