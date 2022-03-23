import { GroupMotor, Instant, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { useBinding, useEffect, useMemo } from "@rbxts/roact-hooked";

type GroupMotorGoals<T> = T extends Array<number>
	? Array<Spring | Instant>
	: T extends { [name: string]: number }
	? { [P in keyof T]?: Spring | Instant }
	: never;

export function useGroupMotor<T extends number[] | Readonly<Record<string, number>>>(
	initialValue: T,
): [Roact.Binding<T>, (goal: GroupMotorGoals<T>) => void, GroupMotor<T>] {
	const motor = useMemo(() => new GroupMotor(initialValue), []);
	const [binding, setBinding] = useBinding(motor.getValue());

	useEffect(() => {
		motor.onStep(setBinding);
	}, []);

	const setGoal = (goal: GroupMotorGoals<T>) => {
		motor.setGoal(goal);
	};

	return [binding, setGoal, motor];
}
