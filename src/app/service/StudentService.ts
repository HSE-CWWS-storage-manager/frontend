import type AppService from "./AppService.ts";
import type AppStore from "../store/AppStore.ts";
import type AppApi from "../api/AppApi.ts";
import type Student from "../../domain/student.ts";

class StudentService {
    constructor(private service: AppService, private store: AppStore, private api: AppApi) {}

    async get(name: string, group: string): Promise<Student> {
        return this.api.student
            .get({name, group})
            .catch(() => {
                return this.api.student.create({name, group});
            })
    }
}

export default StudentService;