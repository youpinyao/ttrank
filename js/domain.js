let domain = '/';

if (process.env.NODE_ENV === 'production') {
  domain = 'https://ttgame-liunx.zhanzhibin.com/';
}

export default domain;
