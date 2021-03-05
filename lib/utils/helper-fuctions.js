import { firstValueFrom, isObservable } from "rxjs";
export const pathMatchKey = {
    delimiter: "/",
    name: "id",
    prefix: "",
    optional: true,
    partial: true,
    pattern: "*",
    repeat: true,
};
export const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body.firstElementChild;
};
// Function handles guards
export const guardHandler = async (guardExist, initiator) => {
    const guard = guardExist();
    //  Check if guard is an observable or promise and resolve it
    const guardResolved = isObservable(guard)
        ? await firstValueFrom(guard)
        : await Promise.resolve(guard);
    //  End function if the resolved value is false and replace path with old path
    if (!guardResolved) {
        if (initiator === "parent") {
            // history.back();
        }
    }
    return guardResolved;
};
export const routStringFormatter = (routePath) => {
    const routeRegexStringArray = routePath.split("/");
    if (routeRegexStringArray[routeRegexStringArray.length - 1].startsWith("*") ||
        routeRegexStringArray[routeRegexStringArray.length - 1].startsWith(":")) {
        routeRegexStringArray.pop();
        // console.log(routeRegexStringArray)
    }
    return routeRegexStringArray.join("/");
};
