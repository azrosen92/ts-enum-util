import {EnumWrapper} from "../src";

// NOTE: Intentionally out of order to test that EnumWrapper iteration is always based
//       on sorted keys.
enum TestEnum {
    D = 0, // duplicate of A
    B = 1,
    A = 0,
    C = 2
}

describe("EnumWrapper: string enum", () => {
    const enumWrapper = EnumWrapper.createUncachedInstance(TestEnum);

    test("toString()", () => {
        expect(String(enumWrapper)).toBe("[object EnumWrapper]");
    });

    test("createUncachedInstance()", () => {
        const result1 = EnumWrapper.createUncachedInstance(TestEnum);
        const result2 = EnumWrapper.createUncachedInstance(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns new instance
        expect(result1).not.toBe(result2);
    });

    test("getCachedInstance()", () => {
        const result1 = EnumWrapper.getCachedInstance(TestEnum);
        const result2 = EnumWrapper.getCachedInstance(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });

    test("is ArrayLike", () => {
        expect(enumWrapper.length).toBe(4);
        expect(enumWrapper[0]).toEqual(["A", TestEnum.A]);
        expect(enumWrapper[1]).toEqual(["B", TestEnum.B]);
        expect(enumWrapper[2]).toEqual(["C", TestEnum.C]);
        expect(enumWrapper[3]).toEqual(["D", TestEnum.D]);
    });

    test("size", () => {
        expect(enumWrapper.size).toBe(4);
    });

    test("get()", () => {
        expect(enumWrapper.get("A")).toBe(TestEnum.A);
        expect(enumWrapper.get("B")).toBe(TestEnum.B);
        expect(enumWrapper.get("C")).toBe(TestEnum.C);
        expect(enumWrapper.get("D")).toBe(TestEnum.D);

        expect(enumWrapper.get("blah")).toBe(undefined);
    });

    test("has()", () => {
        expect(enumWrapper.has("A")).toBe(true);
        expect(enumWrapper.has("B")).toBe(true);
        expect(enumWrapper.has("C")).toBe(true);
        expect(enumWrapper.has("D")).toBe(true);

        expect(enumWrapper.has("blah")).toBe(false);
    });

    test("getKeys()", () => {
        const expected = [
            "A",
            "B",
            "C",
            "D"
        ];
        const result = enumWrapper.getKeys();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = "C";
        expect(enumWrapper.getKeys()).toEqual(expected);
    });

    test("getValues()", () => {
        const expected = [
            TestEnum.A,
            TestEnum.B,
            TestEnum.C,
            TestEnum.D
        ];
        const result = enumWrapper.getValues();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = TestEnum.C;
        expect(enumWrapper.getValues()).toEqual(expected);
    });

    test("getEntries()", () => {
        const expected = [
            ["A", TestEnum.A],
            ["B", TestEnum.B],
            ["C", TestEnum.C],
            ["D", TestEnum.D]
        ];
        const result = enumWrapper.getEntries();
        expect(result).toEqual(expected);

        // test for defensive copy
        // "as any" required to bypass readonly
        (result[0][1] as any) = TestEnum.C;
        expect(enumWrapper.getEntries()).toEqual(expected);
    });

    test("keys()", () => {
        // keys() returns an iterator
        expect(enumWrapper.keys().next()).toEqual({
            done: false,
            value: "A"
        });

        const expected = [
            "A",
            "B",
            "C",
            "D"
        ];
        const result = Array.from(enumWrapper.keys());
        expect(result).toEqual(expected);
    });

    test("values()", () => {
        // values() returns an iterator
        expect(enumWrapper.values().next()).toEqual({
            done: false,
            value: TestEnum.A
        });

        const expected = [
            TestEnum.A,
            TestEnum.B,
            TestEnum.C,
            TestEnum.D
        ];
        const result = Array.from(enumWrapper.values());
        expect(result).toEqual(expected);
    });

    test("entries()", () => {
        // entries() returns an iterator
        expect(enumWrapper.entries().next()).toEqual({
            done: false,
            value: ["A", TestEnum.A]
        });

        const expected = [
            ["A", TestEnum.A],
            ["B", TestEnum.B],
            ["C", TestEnum.C],
            ["D", TestEnum.D]
        ];
        const result = Array.from(enumWrapper.entries());
        expect(result).toEqual(expected);
    });

    test("@@iterator()", () => {
        const expected = [
            ["A", TestEnum.A],
            ["B", TestEnum.B],
            ["C", TestEnum.C],
            ["D", TestEnum.D]
        ];
        const result = Array.from(enumWrapper);
        expect(result).toEqual(expected);
    });

    describe("forEach()", () => {
        test("without context", () => {
            const context = {
                iteratee: function(): void {
                    expect(this).not.toBe(context);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            enumWrapper.forEach(iterateeSpy);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", TestEnum],
                [TestEnum.B, "B", TestEnum],
                [TestEnum.C, "C", TestEnum],
                [TestEnum.D, "D", TestEnum]
            ]);
        });

        test("with context", () => {
            const context = {
                iteratee: function(): void {
                    expect(this).toBe(context);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            enumWrapper.forEach(iterateeSpy, context);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", TestEnum],
                [TestEnum.B, "B", TestEnum],
                [TestEnum.C, "C", TestEnum],
                [TestEnum.D, "D", TestEnum]
            ]);
        });
    });

    describe("map()", () => {
        test("without context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).not.toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy);

            expect(result).toEqual([
                "A0",
                "B1",
                "C2",
                "D0"
            ]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", TestEnum],
                [TestEnum.B, "B", TestEnum],
                [TestEnum.C, "C", TestEnum],
                [TestEnum.D, "D", TestEnum]
            ]);
        });

        test("with context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy, context);

            expect(result).toEqual([
                "A0",
                "B1",
                "C2",
                "D0"
            ]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.A, "A", TestEnum],
                [TestEnum.B, "B", TestEnum],
                [TestEnum.C, "C", TestEnum],
                [TestEnum.D, "D", TestEnum]
            ]);
        });
    });

    test("isKey()", () => {
        expect(enumWrapper.isKey("A")).toBe(true);
        expect(enumWrapper.isKey("B")).toBe(true);
        expect(enumWrapper.isKey("C")).toBe(true);
        expect(enumWrapper.isKey("D")).toBe(true);

        expect(enumWrapper.isKey("blah")).toBe(false);
    });

    test("asKey()", () => {
        expect(enumWrapper.asKey("A")).toBe("A");
        expect(enumWrapper.asKey("B")).toBe("B");
        expect(enumWrapper.asKey("C")).toBe("C");
        expect(enumWrapper.asKey("D")).toBe("D");

        expect(() => {
            enumWrapper.asKey("blah");
        }).toThrow();
    });

    test("asKeyOrDefault()", () => {
        expect(enumWrapper.asKeyOrDefault("A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault("B")).toBe("B");
        expect(enumWrapper.asKeyOrDefault("C")).toBe("C");
        expect(enumWrapper.asKeyOrDefault("D")).toBe("D");

        expect(enumWrapper.asKeyOrDefault("blah")).toBe(undefined);
        expect(enumWrapper.asKeyOrDefault("blah", "A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault("blah", "foo")).toBe("foo");
    });

    test("isValue()", () => {
        expect(enumWrapper.isValue(TestEnum.A)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.B)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.C)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.D)).toBe(true);

        expect(enumWrapper.isValue(-1)).toBe(false);
    });

    test("asValue()", () => {
        expect(enumWrapper.asValue(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValue(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValue(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValue(TestEnum.D)).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.asValue(-1);
        }).toThrow();
    });

    test("asValueOrDefault()", () => {
        expect(enumWrapper.asValueOrDefault(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrDefault(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrDefault(TestEnum.D)).toBe(TestEnum.D);

        expect(enumWrapper.asValueOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.asValueOrDefault(-1, TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(-1, -2)).toBe(-2);
    });

    test("getKey()", () => {
        // A and D have duplicate values, but D is ordered after A, and last duplicate entry wins,
        // so D's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKey(TestEnum.A)).toBe("D");
        expect(enumWrapper.getKey(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKey(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKey(TestEnum.D)).toBe("D");

        expect(() => {
            enumWrapper.getKey(-1);
        }).toThrow();
    });

    test("getKeyOrDefault()", () => {
        // A and D have duplicate values, but D is ordered after A, and last duplicate entry wins,
        // so D's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKeyOrDefault(TestEnum.A)).toBe("D");
        expect(enumWrapper.getKeyOrDefault(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKeyOrDefault(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKeyOrDefault(TestEnum.D)).toBe("D");

        expect(enumWrapper.getKeyOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.getKeyOrDefault(-1, "A")).toBe("A");
        expect(enumWrapper.getKeyOrDefault(-1, "foo")).toBe("foo");
    });

    test("getValue()", () => {
        expect(enumWrapper.getValue("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValue("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValue("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValue("D")).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.getValue("blah");
        }).toThrow();
    });

    test("getValueOrDefault()", () => {
        expect(enumWrapper.getValueOrDefault("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrDefault("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValueOrDefault("D")).toBe(TestEnum.D);

        expect(enumWrapper.getValueOrDefault("blah")).toBe(undefined);
        expect(enumWrapper.getValueOrDefault("blah", TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("blah", -1)).toBe(-1);
    });
});
