import { ObservableInput, of, OperatorFunction } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Err, Ok, Result } from './index';

export function resultMap<T, T2, E>(mapper: (val: T) => T2): OperatorFunction<Result<T, E>, Result<T2, E>> {
    return (source) => {
        return source.pipe(
          map(result => result.map(mapper))
        );
    };
}

export function resultMapErr<T, E, E2>(mapper: (val: E) => E2): OperatorFunction<Result<T, E>, Result<T, E2>> {
    return (source) => {
        return source.pipe(
          map(result => result.mapErr(mapper))
        );
    };
}

export function resultMapTo<T, T2, E>(value: T2): OperatorFunction<Result<T, E>, Result<T2, E>> {
    return (source) => {
        return source.pipe(
          map(result => result.map(() => value))
        );
    };
}

export function resultMapErrTo<T, E, E2>(value: E2): OperatorFunction<Result<T, E>, Result<T, E2>> {
    return (source) => {
        return source.pipe(
          map(result => result.mapErr(() => value))
        );
    };
}

export function elseMap<T, E, E2>(mapper: (val: E) => E2): OperatorFunction<Result<T, E>, T | E2> {
    return (source) => {
        return source.pipe(
          map(result => {
              if (result.err) {
                  return mapper(result.val);
              } else {
                  return result.val;
              }
          })
        );
    };
}

export function elseMapTo<T, E, E2>(value: E2): OperatorFunction<Result<T, E>, T | E2> {
    return (source) => {
        return source.pipe(
          map(result => {
              if (result.err) {
                  return value;
              } else {
                  return result.val;
              }
          })
        );
    };
}

export function resultSwitchMap<T, E, T2, E2>(mapper: (val: T) => ObservableInput<Result<T2, E2>>): OperatorFunction<Result<T, E>, Result<T2, E | E2>>
export function resultSwitchMap<T, T2, E>(mapper: (val: T) => ObservableInput<T2>): OperatorFunction<Result<T, E>, Result<T2, E>>
export function resultSwitchMap<T, E, T2, E2>(mapper: (val: T) => ObservableInput<Result<T2, E2> | T2>): OperatorFunction<Result<T, E>, Result<T2, E | E2>> {
    return (source) => {
        return source.pipe(
          switchMap(result => {
              if (result.ok) {
                  return mapper(result.val);
              } else {
                  return of(result);
              }
          }),
          map(result => {
              if (result instanceof Ok || result instanceof Err) {
                  return result;
              } else {
                  return new Ok(result);
              }
          })
        );
    };
}

export function resultMergeMap<T, E, T2, E2>(mapper: (val: T) => ObservableInput<Result<T2, E2>>): OperatorFunction<Result<T, E>, Result<T2, E | E2>>
export function resultMergeMap<T, T2, E>(mapper: (val: T) => ObservableInput<T2>): OperatorFunction<Result<T, E>, Result<T2, E>>
export function resultMergeMap<T, E, T2, E2>(mapper: (val: T) => ObservableInput<Result<T2, E2> | T2>): OperatorFunction<Result<T, E>, Result<T2, E | E2>> {
    return (source) => {
        return source.pipe(
          mergeMap(result => {
              if (result.ok) {
                  return mapper(result.val);
              } else {
                  return of(result);
              }
          }),
          map(result => {
              if (result instanceof Ok || result instanceof Err) {
                  return result;
              } else {
                  return new Ok(result);
              }
          })
        );
    };
}

export function filterResultOk<T>(): OperatorFunction<Result<T, unknown>, T> {
    return (source) => {
        return source.pipe(
          filter((result): result is Ok<T> => result.ok),
          map(result => result.val)
        )
    }
}

export function filterResultErr<E>(): OperatorFunction<Result<unknown, E>, E> {
    return (source) => {
        return source.pipe(
          filter((result): result is Err<E> => result.err),
          map(result => result.val)
        )
    }
}
