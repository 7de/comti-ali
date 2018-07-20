require('./config$');

function success() {
require('../..//app');
require('../../page/home/home');
require('../../page/component/index');
require('../../page/personal/personal');
require('../../page/order/order');
require('../../page/wallet/wallet');
require('../../page/wallet-detail/wallet-detail');
require('../../page/wallet-topup/wallet-topup');
require('../../page/wallet-topup-record/wallet-topup-record');
require('../../page/message/message');
require('../../page/setting/setting');
require('../../page/help/help');
require('../../page/about/about');
require('../../page/scancode/scancode');
require('../../page/charging/charging');
require('../../page/authorize/authorize');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();