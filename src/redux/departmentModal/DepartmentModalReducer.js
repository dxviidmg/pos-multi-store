import { SHOW_MODAL, HIDE_MODAL } from './DepartmentModalActions';

const initialState = {
  showDepartmentModal: false,
  department: {}
};

const DepartmentModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL: {
        return {
          showDepartmentModal: true,
          department: action.payload
        };
      }

      case HIDE_MODAL: {
        return {
          showDepartmentModal: false,
          department: {}
        };
      }

    default:
      return state;
  }
};

export default DepartmentModalReducer;
