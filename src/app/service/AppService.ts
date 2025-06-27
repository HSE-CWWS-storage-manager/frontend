import type AppStore from "../store/AppStore.ts";
import type AppApi from "../api/AppApi.ts";
import EquipmentService from "./EquipmentService.ts";
import StudentService from "./StudentService.ts";
import OperationService from "./OperationService.ts";

class AppService {
    equipment: EquipmentService;
    student: StudentService;
    operation: OperationService;

    constructor(private store: AppStore, private api: AppApi) {
        this.equipment = new EquipmentService(this, store, api)
        this.student = new StudentService(this, store, api)
        this.operation = new OperationService(this, store, api)
    }
}

export default AppService;