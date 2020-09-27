'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/ceshi', controller.home.ceshi);
  // router.get('/ceshi2', controller.home.ceshi2);
  router.get('/getSwiper', controller.home.getSwiper);
  router.get('/getMyList', controller.home.getMyList);
  router.get('/getMyListFromType/:type/:sort', controller.home.getMyListFromType);
  router.get('/getMyListFromSort/:sort/:type', controller.home.getMyListFromSort);
  router.get('/getItemDetails/:id', controller.home.getItemDetails);
  router.get('/getItemType', controller.home.getItemType);
  router.get('/getUnitList', controller.home.getUnitList);
  router.post('/upImgToTemporary', controller.home.upImgToTemporary);
  router.post('/addItemSubmit', controller.home.addItemSubmit);
  router.delete('/delItem/:id', controller.home.delItem);
  router.delete('/delItems/:ids', controller.home.delItems);
  router.get('/getGropType', controller.home.getGropType);
  router.delete('/delGropType/:id', controller.home.delGropType);
  router.post('/addGropType', controller.home.addGropType);
  router.get('/joinGrop/:id/:gropName', controller.home.joinGrop);
  router.get('/getGropList/:sort/:type', controller.home.getGropList);
};
