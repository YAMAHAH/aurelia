import {
  $BuiltinFunction,
  $GetPrototypeFromConstructor,
  $Function,
} from '../types/function';
import {
  Realm,
  ExecutionContext,
} from '../realm';
import {
  $AnyNonEmpty,
  CompletionType,
} from '../types/_shared';
import {
  $Error,
} from '../types/error';
import {
  $String,
} from '../types/string';
import {
  $Undefined,
} from '../types/undefined';
import {
  $StringExoticObject,
} from '../exotics/string';
import {
  $FunctionPrototype,
} from './function';
import {
  $Object,
} from '../types/object';
import {
  $ObjectPrototype,
} from './object';

// http://www.ecma-international.org/ecma-262/#sec-string-constructor
export class $StringConstructor extends $BuiltinFunction<'%String%'> {
  public get $prototype(): $StringPrototype {
    return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'] as $StringPrototype;
  }
  public set $prototype(value: $StringPrototype) {
    this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
  }

  public constructor(
    realm: Realm,
    functionPrototype: $FunctionPrototype,
  ) {
    super(realm, '%String%', functionPrototype);
  }

  // http://www.ecma-international.org/ecma-262/#sec-string-constructor-string-value
  public performSteps(
    ctx: ExecutionContext,
    thisArgument: $AnyNonEmpty,
    argumentsList: readonly $AnyNonEmpty[],
    NewTarget: $Function | $Undefined,
  ): $AnyNonEmpty | $Error {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    let s: $String;

    // 1. If no arguments were passed to this function invocation, let s be "".
    if (argumentsList.length === 0) {
      s = new $String(realm, '');
    }
    // 2. Else,
    else {
      const [value] = argumentsList;

      // 2. a. If NewTarget is undefined and Type(value) is Symbol, return SymbolDescriptiveString(value).
      if (NewTarget.isUndefined && value.isSymbol) {
        // TODO: implement this
      }

      // 2. b. Let s be ? ToString(value).
      const $s = value.ToString(ctx);
      if ($s.isAbrupt) { return $s; }

      s = $s;
    }

    // 3. If NewTarget is undefined, return s.
    if (NewTarget.isUndefined) {
      return s;
    }

    // 4. Return ! StringCreate(s, ? GetPrototypeFromConstructor(NewTarget, "%StringPrototype%")).
    const proto = $GetPrototypeFromConstructor(ctx, NewTarget, '%StringPrototype%');
    if (proto.isAbrupt) { return proto; }

    return new $StringExoticObject(realm, s, proto);
  }
}

// http://www.ecma-international.org/ecma-262/#sec-properties-of-the-string-prototype-object
export class $StringPrototype extends $Object<'%StringPrototype%'> {
  public get $constructor(): $StringConstructor {
    return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'] as $StringConstructor;
  }
  public set $constructor(value: $StringConstructor) {
    this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
  }

  public '[[StringData]]': $String;

  public constructor(
    realm: Realm,
    objectPrototype: $ObjectPrototype,
  ) {
    const intrinsics = realm['[[Intrinsics]]'];
    super(realm, '%StringPrototype%', objectPrototype, CompletionType.normal, intrinsics.empty);

    this['[[StringData]]'] = new $String(realm, '');
  }
}