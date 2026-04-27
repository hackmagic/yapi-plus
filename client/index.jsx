import './styles/common.scss';
import './styles/theme.less';
import './plugin';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Application';
import { Provider } from 'react-redux';
import createStore from './reducer/create';
import { ConfigProvider } from 'naive-ui';
import { zhCN } from 'naive-ui/lib/locales';

const store = createStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
);
