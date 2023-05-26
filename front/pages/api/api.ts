import { CategoryData, ScrapData } from "./apiDataType"

interface Result<T> {
    type(account_id: string, type: any): unknown
    isError: boolean,
    result: T | null,
    error: string
}
function createResult<T>(result: T | null, isError: boolean = true, error: string = "") {
    return { isError: isError, result: result, error: error } as Result<T>
}

namespace Api {

    const apiURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

    export async function getScrapData(url: string) {
        return get<ScrapData>("scrap-url", `url=${url}`)
    }



    export async function getAllCategory() {
        return get<CategoryData[]>("all-category", '')
    }


    export async function addProduct(adminId: string, categoryId: number, scrapData: ScrapData) {
        let productData = {
            adminId: adminId,
            categoryId: categoryId,
            data: scrapData

        }
        return post("admin/product", "", productData)
    }


    export async function addCategory(adminId: string, categoryName: string) {
        let categoryData = {
            adminId: adminId,
            name: categoryName

        }
        return post("admin/category", "", categoryData)
    }

    // export async function getAllProducts(categoryId: number)




















    async function get<T>(path: string, query: string) {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                const data = JSON.parse(await res.json()) as T
                return createResult<T>(data, false)
            } else {
                return createResult<T>(null, true, await res.text())
            }
        } catch (error) {
            return createResult<T>(null, true, "fetch error")
        }
    }

    async function post<T>(path: string, query: string, body: any) {
        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(body),
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                return createResult<T>(await res.json(), false)
            } else {
                return createResult(null, true, await res.text())
            }
        } catch (error) {
            return createResult<T>(null, true, "fetch error")
        }
    }

}

export default Api