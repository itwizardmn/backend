const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user model' });
const EmployeeModel = require('./EmployeeModel');
const Query = require('../database/Mybatis');
const path = require('path');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const getSuperAdmin = async (requestData, ) => {
    try {  
      const params = {
        siteSeq : 1
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.SITE,'selectSiteInfo', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const selectUser = async (requestData, ID = null) => {
    try {
  
      let userID    = null ;
      if(ID !== null){
        userID = ID;
      }
      else{
        userID = requestData.getUserID();
      }
  
      const params = {
        [DB_FIELD_NAME.USER_ID] :  userID ,
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.USER,'selectUser', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const insertUser = async (requestData) => {

    try {
        const userID    = requestData.getBodyValue(DB_FIELD_NAME.USER_ID);
        const password  = requestData.getBodyValue(DB_FIELD_NAME.PASSWORD);
        const userName  = requestData.getBodyValue(DB_FIELD_NAME.USER_NAME);
        const salt      = requestData.getBodyValue(DB_FIELD_NAME.SALT);

        const params = {
        [DB_FIELD_NAME.USER_ID]   : userID,
        [DB_FIELD_NAME.PASSWORD]  : password,
        [DB_FIELD_NAME.USER_NAME] : userName,
        [DB_FIELD_NAME.SALT]      : salt,
        };

        const connection = requestData.getConnection();

        const statement = Query(NAMESPACE.USER,'insertUser', params);
        const res = await connection.query(statement);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
        Logger.error(e.stack);
        throw e;
    }
};

const updateUser = async (requestData, params) => {

    try {
  
      const userID = requestData.getUserID();
      params[DB_FIELD_NAME.USER_ID]= userID;
  
      const connection = requestData.getConnection();
  
      const statement = Query(NAMESPACE.USER,'updateUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const deleteUser = async (requestData) => {

    try {
      const userID    = requestData.getUserID();
  
      const connection = requestData.getConnection();
  
      const params = {
        [DB_FIELD_NAME.USER_ID]   : userID,
      };
  
      const statement = Query(NAMESPACE.USER,'deleteUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  };

  const updateProfession = async (requestData) => {
    try {
      const params = {
        seq : requestData.getBodyValue('seq'),
        pro_name : requestData.getBodyValue('pro_name')
      };

      const connection = requestData.getConnection();
  
      const statement = Query(NAMESPACE.USER,'updateProfession', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;

    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const addProfession = async (requestData) => {
    try {
      const params = {
        pro_name : requestData.getBodyValue('pro_name')
      };

      const connection = requestData.getConnection();
      const statement = Query(NAMESPACE.USER,'insertProfession', params);
      const res = await connection.query(statement);
      console.log(res, '====sda====');
      return res;
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const deleteProf = async (requestData) => {
    try {
      const params = {
        seq : requestData.getBodyValue('seq')
      };

      const connection = requestData.getConnection();
      const statement = Query(NAMESPACE.USER,'deleteProfession', params);
      const res = await connection.query(statement);
      return res;
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const getEmployees = async (requestData) => {
    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'getEmployees');
    console.log(statement);
    const [dataSet] = await connection.query(statement);
    return dataSet;
  }

  const deleteEmployee = async (requestData) => {
    const params = {
      seq : requestData.getBodyValue('seq')
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'deleteEmployee', params);
    const res = await connection.query(statement);
    return res;
  }

  const updateEmployee = async (requestData) => {
    const body = requestData.getBodyValue('info');
    const params = {
      seq: body.seq,
      pro_seq: body.pro_seq,
      team_seq: body.team_seq,
      sort: body.sort,
      levels: body.levels
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'updateEmployee', params);

    console.log(params, '==========', statement);
    const res = await connection.query(statement);
    return res;
  }

  const updatePhoto = async (requestData) => {

    try {
        const params = {
            ['file'] : requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
            ['seq'] : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : '',
            ['photo'] : requestData.getBodyValue('photo') != null ? requestData.getBodyValue('photo') : ''
        }
    
        await EmployeeModel.removeSingleFile(requestData, params.photo);
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.USER, 'updatePhoto', params);
        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}
  
  module.exports = {
    selectUser,
    insertUser,
    updateUser,
    deleteUser,
    getSuperAdmin,
    updateProfession,
    addProfession,
    deleteProf,
    getEmployees,
    deleteEmployee,
    updateEmployee,
    updatePhoto
  };