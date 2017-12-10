import $ from 'jquery';
import template from 'art-template/lib/template-web';
import urls from './urls';
import TYPES from './types';

import '../css/style.scss';

window.selectType = selectType;

let tabTimer = null;

const ranksData = {
  [TYPES.DAY]: null,
  [TYPES.WEEK]: null,
  [TYPES.MONTH]: null,
  [TYPES.TOTAL]: null,
};

const configData = {
  currentTab: 'day',
  dataInterval: 6000,
  tabInterval: 6000,
  types: ['day', 'week', 'month', 'total'],
};

updateConfig().done(updateRank);

function updateRank() {
  Object.keys(ranksData).forEach(type => {
    $.get(urls.rank, {
      type,
    }).then(data => {
      ranksData[type] = data.result.list.map(item => {
        item.score = renderScore(item.score);
        return item;
      });

      if (configData.currentTab === type) {
        updateRankView();
      }
    });
  });
}

function updateConfig() {
  return $.get(urls.config).then(({
    result: {
      types,
      dataInterval,
      tabInterval,
    }
  }) => {
    // 如果tab不存在就默认第一个
    if (types.indexOf(configData.currentTab) === -1) {
      configData.currentTab = types[0];
    }

    // 定时切换tab
    if (tabTimer === null || configData.tabInterval !== tabInterval) {
      clearInterval(tabTimer);

      tabTimer = setInterval(() => {
        nextType();
      }, tabInterval);
    }

    configData.types = types;
    configData.dataInterval = dataInterval;
    configData.tabInterval = tabInterval;

    stUpdate();

    updateView();
  }, () => {
    stUpdate();
  });
}

function stUpdate() {
  // 倒计时更新数据
  setTimeout(() => {
    updateConfig().done(updateRank);
  }, configData.tabInterval || 5000);
}

function updateView() {
  $('.tabs').replaceWith(template.render(require('../templates/tabs.html'), {
    ...configData
  }));
}

function updateRankView() {
  $('.content').replaceWith(template.render(require('../templates/rank.html'), {
    list: ranksData[configData.currentTab],
  }));
}

function selectType(type) {
  configData.currentTab = type;
  updateRankView();
  updateView();
}

function nextType() {
  const types = configData.types;
  let type = configData.currentTab;
  let index = configData.types.indexOf(type);

  if (configData.types.indexOf(type) === -1) {
    type = types[0];
  } else {
    index++;
    if (index >= types.length) {
      index = 0;
    }
    type = types[index];
  }

  selectType(type);
}

function renderScore(score) {
  let hour = 0;
  let minute = 0;
  let second = 0;
  let ret = '';

  if (score) {
    hour = parseInt(score / (1000 * 60 * 60), 10);
    minute = parseInt((score % (1000 * 60 * 60)) / (1000 * 60), 10);
    second = parseInt((score % (1000 * 60)) / 1000, 10);
  }

  if (hour) {
    ret += `${hour}h`;
  }
  if (minute) {
    ret += `${minute}min`;
  }
  if (second) {
    ret += `${second}s`;
  }
  return ret;
}
