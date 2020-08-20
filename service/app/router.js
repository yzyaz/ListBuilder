'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getSwiper', controller.home.getSwiper);
  router.get('/getMyList', controller.home.getMyList);
  router.get('/getItemType', controller.home.getItemType);
  router.get('/getUnitList', controller.home.getUnitList);
  router.post('/upImgToTemporary', controller.home.upImgToTemporary);
  router.post('/addItemSubmit', controller.home.addItemSubmit);
};
