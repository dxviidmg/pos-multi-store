import { createApiService } from "./apiFactory";

const departmentService = createApiService("department", { pluralDelete: "departments/delete" });

export const getDepartments = departmentService.getAll;
export const createDepartment = departmentService.create;
export const updateDepartment = departmentService.update;
export const deleteDepartments = departmentService.deleteMany;
