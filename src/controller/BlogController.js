const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'blog controller' });

const path = require('path');

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const { RESPONSE_CODE, RESPONSE_FIELD  } = require('../common/ResponseConst');

const fileUpload = require('../middleware/FileUpload');

const BlogModel = require('../model/BlogModel');
const FileModel = require('../model/FileModel');

const getBlogs = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {

        const fieldList = [
            'lang'
        ];

        // if (!requestData.hasAllMandatoryFields(fieldList)) {
        //     return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        // }

        await requestData.start(true);
        const blogList = await BlogModel.getBlogs(requestData, requestData.getBodyValue('blogSeq'), requestData.getBodyValue('lang'));
        responseData.setDataValue(RESPONSE_FIELD.DATA, blogList);

        if(blogList){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
        
        // await requestData.end(true);
    } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const insertBlog = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = [
            'title',
            'content',
            'isVisible',
            'url'
        ];
        // if (!requestData.hasAllMandatoryFields(fieldList)) {
        //     return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        // }

        if (!requestData.isConnected()) {
            await requestData.start(true);
        }

        const fileResult = {};

        if(req.file){      
            requestData.setBodyValue('file', req.file)  
            const fileResult = await FileModel.insertFile(requestData);
    
            if(!fileResult){
                responseData.setResponseCode(RESPONSE_CODE.FILE_ERROR);
            } 
            requestData.setBodyValue('thumbnailSeq', fileResult[0].insertId);
        }

        const result = await BlogModel.insertBlog(requestData);

        if (result) {
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        } else {
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }

    } catch (e) {
        console.log(e);
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }

};


const remove = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = ['blog_seq'];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }

        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const result = await BlogModel.remove(requestData);

        if (result) {
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        } else {
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        console.log(e);
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
}
module.exports = {
    getBlogs,
    insertBlog,
    remove
}