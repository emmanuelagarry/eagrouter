import { isObservable, Observable, firstValueFrom } from "rxjs";

export const pathMatchKey = {
  delimiter: "/",
  name: "id",
  prefix: "",
  optional: true,
  partial: true,
  pattern: "*",
  repeat: true,
};

export const stringToHTML = (str: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.firstElementChild!;
};

// Function handles guards
export const guardHandler = async (
  guardExist: () => boolean | Observable<boolean> | Promise<boolean>,
  initiator: "parent" | "child"
) => {
  const guard = guardExist();

  //  Check if guard is an observable or promise and resolve it
  const guardResolved = isObservable(guard)
    ? await firstValueFrom(guard)
    : await Promise.resolve(guard);

  //  End function if the resolved value is false and replace path with old path
  return guardResolved;
};

export const routStringFormatter = (routePath: string) => {
  const routeRegexStringArray = routePath.split("/");

  if (
    routeRegexStringArray[routeRegexStringArray.length - 1].startsWith("*") ||
    routeRegexStringArray[routeRegexStringArray.length - 1].startsWith(":")
  ) {
    routeRegexStringArray.pop();

    // console.log(routeRegexStringArray)
  }

  return routeRegexStringArray.join("/");
};
