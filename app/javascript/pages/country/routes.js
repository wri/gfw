import Root from './components/root/root';

export default [
  {
    path: '/country/:iso',
    component: Root,
    exact: true
  },
  {
    path: '/country/:iso/:region',
    component: Root,
    exact: true
  }
];
