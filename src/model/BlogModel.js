const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'blog model' });

const Query = require('../database/Mybatis');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');
const { EXPECTATION_FAILED } = require('http-status-codes');

const getBlogs = async (requestData, id = null) => {

    let blogId = null;
    if(id != null) {
        blogId = id;
    }

    const params = {
        blogSeq :  blogId,
      };

    try {
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.BLOG, 'getBlogs', params);

        const [dataSet] = await connection.query(queryString);
        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const insertBlog = async (requestData) => {

    const params = {
        blogSeq :  requestData.getBodyValue('blogSeq') != null ? requestData.getBodyValue('blogSeq') : '',
        title :  requestData.getBodyValue('title') != null ? requestData.getBodyValue('title') : '',
        content :  requestData.getBodyValue('content') != null ? requestData.getBodyValue('content') : '',
        isVisible :  requestData.getBodyValue('isVisible') != null ? requestData.getBodyValue('isVisible') : '',
        thumbnailSeq :  requestData.getBodyValue('thumbnailSeq') != null ? requestData.getBodyValue('thumbnailSeq') : '',
        url :  requestData.getBodyValue('url') != null ? requestData.getBodyValue('url') : '',
        contentType :  requestData.getBodyValue('contentType') != null ? requestData.getBodyValue('contentType') : '',
    };

    try {
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.BLOG, 'insert', params);
        const res = await connection.query(queryString);
        
        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}


const remove = async (requestData) => {
    params = { blog_seq : requestData.getBodyValue('blog_seq')};

    try {
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.BLOG, 'deleted', params);
        console.log(queryString, '================');
        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

module.exports = {
    getBlogs,
    insertBlog,
    remove
}