import { firstValueFrom, isObservable, Observable } from "rxjs";

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
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return doc.body.firstElementChild!;
};

// Function handles guards
export const guardHandler = async (
  guardExist: () => boolean | Observable<boolean> | Promise<boolean>,
  initiator: "parent" | "child",
) => {
  const guard = guardExist();

  //  Check if guard is an observable or promise and resolve it
  const guardResolved = isObservable(guard)
    ? await firstValueFrom(guard)
    : await Promise.resolve(guard);

  //  End function if the resolved value is false and replace path with old path
  if (!guardResolved) {
    if (initiator === "parent") {
      history.back()
    }
  }
  return guardResolved;
};
