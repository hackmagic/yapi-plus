import test from 'ava';
const BaseController = require('../../server/controllers/base.js');

test('checkAuth allows danger only for admin/owner', async t => {
  const controller = new BaseController({});
  controller.getProjectRole = async () => 'owner';
  t.true(await controller.checkAuth(1, 'project', 'danger'));

  controller.getProjectRole = async () => 'dev';
  t.false(await controller.checkAuth(1, 'project', 'danger'));
});

test('checkAuth allows edit for dev and above', async t => {
  const controller = new BaseController({});
  controller.getProjectRole = async () => 'dev';
  t.true(await controller.checkAuth(1, 'project', 'edit'));

  controller.getProjectRole = async () => 'guest';
  t.false(await controller.checkAuth(1, 'project', 'edit'));
});

test('checkAuth allows view for guest and above', async t => {
  const controller = new BaseController({});
  controller.getProjectRole = async () => 'guest';
  t.true(await controller.checkAuth(1, 'project', 'view'));

  controller.getProjectRole = async () => 'member';
  t.false(await controller.checkAuth(1, 'project', 'view'));
});
