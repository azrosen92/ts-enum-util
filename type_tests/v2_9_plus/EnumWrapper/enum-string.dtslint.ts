import { $enum } from "ts-enum-util";

// Enum with string values
enum TestEnum {
    A = "a",
    B = "b",
    C = "c"
}

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;
declare const keySubset: "C";
declare const keySubsetOrNull: "C" | null;
declare const keySubsetOrUndefined: "C" | undefined;

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;
declare const valueSubset: TestEnum.A;
declare const valueSubsetOrNull: TestEnum.A | null;
declare const valueSubsetOrUndefined: TestEnum.A | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<typeof TestEnum, TestEnum>
enumWrapper;

// $ExpectType number
enumWrapper.length;
// $ExpectError
enumWrapper.length = 0; // immutable

// $ExpectType number
enumWrapper.size;
// $ExpectError
enumWrapper.size = 0; // immutable

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntry: Readonly<["A" | "B" | "C", TestEnum]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<TestEnum>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<Readonly<
    ["A" | "B" | "C", TestEnum]
>> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<["A" | "B" | "C", TestEnum]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, wrapper, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<typeof TestEnum, TestEnum>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, wrapper, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<typeof TestEnum, TestEnum>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType TestEnum[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<
    ["A" | "B" | "C", TestEnum]
>[] = enumWrapper.getEntries();

// $ExpectType number
enumWrapper.indexOfKey("A");
// $ExpectError
enumWrapper.indexOfKey("foo!");
// $ExpectError
enumWrapper.indexOfKey(str);

// $ExpectType number
enumWrapper.indexOfValue(TestEnum.A);
// $ExpectType number
enumWrapper.indexOfValue(value);
// $ExpectError
enumWrapper.indexOfValue("c");
// $ExpectError
enumWrapper.indexOfValue(str);
// $ExpectError
enumWrapper.indexOfValue(10);
// $ExpectError
enumWrapper.indexOfValue(num);

// $ExpectType boolean
enumWrapper.isKey(str);
// $ExpectType boolean
enumWrapper.isKey(strOrNull);
// $ExpectType boolean
enumWrapper.isKey(strOrUndefined);

if (enumWrapper.isKey(str)) {
    // $ExpectType "A" | "B" | "C"
    str;
}

if (enumWrapper.isKey(strOrNull)) {
    // $ExpectType "A" | "B" | "C"
    strOrNull;
}

if (enumWrapper.isKey(strOrUndefined)) {
    // $ExpectType "A" | "B" | "C"
    strOrUndefined;
}

// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(str);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrUndefined);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, undefined);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrDefault(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, keyOrUndefined);
// $ExpectError
enumWrapper.asKeyOrDefault(str, str);
// $ExpectError
enumWrapper.asKeyOrDefault(str, strOrUndefined);

// $ExpectType boolean
enumWrapper.isValue(str);
// $ExpectType boolean
enumWrapper.isValue(strOrNull);
// $ExpectType boolean
enumWrapper.isValue(strOrUndefined);
// $ExpectError
enumWrapper.isValue(num);

if (enumWrapper.isValue(str)) {
    // $ExpectType TestEnum
    str;
}

if (enumWrapper.isValue(strOrNull)) {
    // $ExpectType TestEnum
    strOrNull;
}

if (enumWrapper.isValue(strOrUndefined)) {
    // $ExpectType TestEnum
    strOrUndefined;
}

// $ExpectType TestEnum
enumWrapper.asValueOrThrow(str);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(strOrNull);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(num);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(strOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str, undefined);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(str, value);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str, valueOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str, str);
// $ExpectError
enumWrapper.asValueOrDefault(str, strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str, num);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(value);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrUndefined);
// $ExpectType "A"
enumWrapper.getKey(valueSubset);
// $ExpectType "A" | undefined
enumWrapper.getKey(valueSubsetOrNull);
// $ExpectType "A" | undefined
enumWrapper.getKey(valueSubsetOrUndefined);
// $ExpectError
enumWrapper.getKey(num);
// $ExpectError
enumWrapper.getKey(str);
// $ExpectError
enumWrapper.getKey(numstr);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(valueOrNull, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrNull, keyOrUndefined);
// $ExpectType "A" | undefined
enumWrapper.getKey(valueSubsetOrNull, undefined);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(valueSubsetOrNull, key);
// $ExpectType "A" | "C"
enumWrapper.getKey(valueSubsetOrNull, "C");
// $ExpectType "A" | "C" | undefined
enumWrapper.getKey(valueSubsetOrNull, keySubsetOrUndefined);
// $ExpectError
enumWrapper.getKey(valueOrNull, str);
// $ExpectError
enumWrapper.getKey(valueOrNull, strOrUndefined);

// $ExpectType TestEnum
enumWrapper.getValue(key);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrUndefined);
// $ExpectType TestEnum.C
enumWrapper.getValue(keySubset);
// $ExpectType TestEnum.C | undefined
enumWrapper.getValue(keySubsetOrNull);
// $ExpectType TestEnum.C | undefined
enumWrapper.getValue(keySubsetOrUndefined);
// $ExpectError
enumWrapper.getValue(str);

// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull, undefined);
// $ExpectType TestEnum
enumWrapper.getValue(keyOrNull, value);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull, valueOrUndefined);
// $ExpectType TestEnum.C | undefined
enumWrapper.getValue(keySubsetOrNull, undefined);
// $ExpectType TestEnum
enumWrapper.getValue(keySubsetOrNull, value);
// $ExpectType TestEnum.A | TestEnum.C
enumWrapper.getValue(keySubsetOrNull, TestEnum.A);
// $ExpectType TestEnum.A | TestEnum.C | undefined
enumWrapper.getValue(keySubsetOrNull, valueSubsetOrUndefined);
// $ExpectError
enumWrapper.getValue(keyOrNull, str);
// $ExpectError
enumWrapper.getValue(keyOrNull, strOrUndefined);
// $ExpectError
enumWrapper.getValue(keyOrNull, num);
