import User from "~/model/User";
import axios from "axios";
import RestDocument, {UserRestObject} from "../rest/RestDocument";
import Optional, {getEmptyOptional} from "~/utils/Optional";

export async function getUserById(userId: string): Promise<Optional<User>> {
    const ar = await axios.get("/v1/users/" + userId)
    if (ar.status == 200) {
        return new Optional((ar.data as RestDocument)["user"] as UserRestObject)
    }
    return getEmptyOptional<User>()
}