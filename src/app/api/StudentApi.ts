import type AppApi from "./AppApi.ts";
import type AppStore from "../store/AppStore.ts";
import Student from "../../domain/student.ts";

class StudentApi {
    constructor(private api: AppApi, private store: AppStore) {}

    async get(student: Omit<Student, "id">): Promise<Student> {
        return this.api.client
            .get("/Student", { params: { ...student } })
            .then((res) => {
                const result = Student.safeParse(res.data)

                if (result.error) {
                    return Promise.reject(result.error);
                }

                return result.data;
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    async getById(id: string): Promise<Student> {
        return this.api.client
            .get("/Student/GetInfo", { params: { StudentId: id } })
            .then((res) => {
                const result = Student.safeParse(res.data)

                if (result.error) {
                    return Promise.reject(result.error);
                }

                return result.data;
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    async create(student: Omit<Student, "id">): Promise<Student> {
        return this.api.client
            .post("/Student", {...student})
            .then((res) => {
                const result = Student.safeParse(res.data)

                if (result.error) {
                    return Promise.reject(result.error);
                }

                return result.data;
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
}

export default StudentApi;