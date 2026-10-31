# Rust fundamentals and Solana: ownership, borrowing, Proof of History and the account model

## Rust basics

Rust is a compiled, statically typed systems language that guarantees memory safety **without a garbage collector**. Programs for Solana are written mainly in Rust, and the rules studied in this lecture (ownership, borrowing, explicit mutability) recur, in another form, in the way Solana organises its state. The examples refer to the two projects of this tutorial: `hello_cargo`, whose file `src/main.rs` contains eleven numbered examples about ownership, and `guessing_game`, the introductory program of *The Rust Programming Language* [1].

### Installation and the toolchain

Rust is installed with **rustup**, the official toolchain manager [2]:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

The installation provides three main tools:

- **`rustc`**, the compiler, which translates a source file into a native executable;
- **`cargo`**, the build system and package manager, which compiles projects, downloads their dependencies and runs their tests;
- **`rustup`** itself, which installs and updates toolchains (`rustup update`) and components such as the formatter `rustfmt` and the linter `clippy`.

### Compiling a program with `rustc`

The smallest Rust program is the file `main.rs` of this tutorial [3]:

```rust
fn main() {
    println!("Hello, world!");
}
```

It is compiled and executed in two separate steps, `rustc main.rs` followed by `./main`. Rust is an **ahead-of-time compiled** language: the executable `main` can be run on another machine with the same operating system and architecture, without Rust being installed there.

- **`fn main()`** is the entry point of every executable program.
- **`println!`** is a **macro**, not a function; the exclamation mark distinguishes the two. A macro is code that generates other code at compile time, a form of **metaprogramming** [4]. `println!` accepts a variable number of arguments and checks, at compile time, that the format string `"{guess}"` refers to variables that exist and can be displayed, which an ordinary function could not do.

### Cargo projects

`rustc` is sufficient for a single file; real projects are managed with Cargo [5]. The command `cargo new hello_cargo` creates the following structure, and also initialises a Git repository (hence the directories `.git` and the files `.gitignore` in both projects):

```
hello_cargo/
├── Cargo.toml        manifest: name, version, edition, dependencies
└── src/
    └── main.rs       source code of the binary crate
```

The manifest `Cargo.toml` is written in TOML. Its section `[package]` describes the project; the field `edition = "2024"` selects the **edition** of the language, a set of syntactic and semantic conventions that allows the language to evolve without breaking existing code. The section `[dependencies]` lists the external libraries, called **crates**.

| Command | Effect |
|---|---|
| `cargo build` | compiles the project into `target/debug/<name>`, without optimisations |
| `cargo run` | compiles the project, if necessary, and executes it |
| `cargo check` | verifies that the code compiles, without producing an executable; much faster than `build` |
| `cargo build --release` | compiles with optimisations into `target/release/<name>` |

At the first build, Cargo creates the file **`Cargo.lock`**, which records the exact version of every dependency. Subsequent builds use these versions, so that the build is **reproducible**, until the dependencies are explicitly updated with `cargo update`.

### The guessing game

The program `guessing_game/src/main.rs` generates a random number between 1 and 100 and asks the user to guess it, indicating after each attempt whether the guess was too small or too big. Despite its brevity, it introduces most of the elementary constructs of the language [1].

**Imports and the prelude.** Every Rust program automatically has access to a small set of items called the **prelude** (`String`, `Vec`, `Option`, `Result`, and others). Other items are brought into scope with `use`: `use std::io;` imports the input/output module of the standard library, and `use std::cmp::Ordering;` imports the type returned by comparisons.

**Dependencies.** The standard library contains no random number generator; the program uses the crate `rand`, declared in `Cargo.toml`:

```toml
[dependencies]
rand = "0.10.1"
```

The specifier `"0.10.1"` is an abbreviation of `^0.10.1`: Cargo accepts any version that is **semantically compatible**, i.e. at least 0.10.1 and below 0.11.0. At the first build, Cargo downloads `rand` and its own dependencies from the registry *crates.io* and records the version chosen (here 0.10.3) in `Cargo.lock`. The line `use rand::prelude::*;` imports the prelude of the crate, which contains in particular the **trait** `RngExt`. A trait is a set of methods that a type may implement; a method of a trait can be called only if the trait is in scope. Without this import, the call `random_range` would not compile.

**Generating the secret number.**

```rust
let secret_number = rand::rng().random_range(1..=100);
```

`rand::rng()` returns a generator local to the current thread, seeded by the operating system. `1..=100` is an **inclusive range** expression (`1..100` would exclude 100). The type of `secret_number` is not written: the compiler **infers** it as `u32`, because the number is later compared with `guess`, which is declared `u32`.

**Variables and mutability.** Variables are **immutable by default**:

```rust
let mut guess = String::new();
```

Without `mut`, any later modification of `guess` is a compile-time error. Immutability by default makes explicit, in the source code, which values may change. `String::new` is an **associated function** of the type `String` (called with `::`), which returns a new empty, growable string.

**Reading the input.**

```rust
io::stdin()
    .read_line(&mut guess)
    .expect("Failed to read line");
```

`read_line` appends the line typed by the user to `guess`. It receives `&mut guess`, a **mutable reference**: the function may modify the string, but does not take ownership of it, so `guess` remains usable afterwards. References are discussed in detail in the section on ownership. Like `let`, references are immutable by default; `&guess` would not allow the string to be modified.

`read_line` returns a value of type **`Result`**, an enumeration with two variants: `Ok`, which contains the result of a successful operation, and `Err`, which contains an error. The method `expect` returns the content of `Ok`, or stops the program (**panics**) with the given message in the case of `Err`. The compiler warns if a `Result` is ignored, because a possible error would then go unnoticed.

**Shadowing and conversion.**

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```

The new variable `guess` **shadows** the previous one: the same name is reused for a value of a different type, which avoids names such as `guess_str` and `guess_num`. `trim` removes the surrounding whitespace, including the newline `\n` stored by `read_line`. `parse` converts the string into a number; the target type is determined by the annotation `u32`. Because the conversion may fail, `parse` also returns a `Result`.

**Pattern matching.** A `match` expression compares a value with a series of **patterns** and executes the arm of the first pattern that matches. Here, `Ok(num)` extracts the number, and `Err(_)` matches any error (`_` is a pattern that ignores the value) and continues with the next iteration of the loop, so that invalid input is simply ignored. The compiler checks that a `match` is **exhaustive**: omitting the arm `Err` would be a compile-time error.

**Comparison and control flow.**

```rust
match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => {
        println!("You win!");
        break;
    }
}
```

`cmp` compares two values and returns a variant of the enumeration `Ordering`. The argument is passed by reference (`&secret_number`), since a comparison has no reason to take the value. `loop` creates an infinite loop, which is left with `break` when the number is found.

Note that the program only ever ignores errors of conversion. If the input stream ends (for example, with Ctrl+D, or when the input is redirected from a file), `read_line` returns `Ok(0)` and leaves `guess` empty, `parse` fails, and the loop continues forever. A robust program would test the number of bytes read.

## Ownership

**Ownership** is the set of rules by which Rust manages memory [6]. It is the most distinctive feature of the language, and the source of most of the compile-time errors encountered by beginners.

### Memory management

Programming languages traditionally manage memory in one of two ways:

- a **garbage collector** (Java, Go, Python, JavaScript) periodically searches for memory that is no longer used and frees it; this is safe, but it costs time at run time, and the moment when memory is freed is not predictable;
- the **programmer** allocates and frees memory explicitly (C, C++); this is efficient, but error-prone: memory freed too early leaves invalid pointers (*use after free*), memory freed twice corrupts the allocator (*double free*), and memory never freed is lost (*memory leak*). Exactly one free must correspond to each allocation.

Rust adopts a third approach: memory is managed through a system of ownership whose rules are **verified by the compiler**. A program that violates them does not compile; a program that compiles requires no garbage collector and contains none of the errors listed above.

### The stack and the heap

A program uses two regions of memory, with different properties:

| | Stack | Heap |
|---|---|---|
| Organisation | last in, first out (LIFO) | arbitrary; the allocator searches for a free area |
| Size of the data | known at compile time, fixed | known only at run time, may change |
| Allocation | moving the stack pointer; very fast | searching for space and bookkeeping; slower |
| Access | direct | through a **pointer** stored elsewhere |
| Freeing | automatic, when the function returns | must be organised by the language or the programmer |

Values of fixed size, such as integers, booleans, characters, and tuples or arrays of such values, are stored on the stack. A value whose size is not known in advance, such as a string read from the user, is stored on the heap. Ownership addresses the problems specific to the heap: knowing which part of the code uses which data, minimising the duplication of data, and freeing data that is no longer used, exactly once.

### Ownership rules

1. Each value in Rust has an **owner**, the variable that holds it.
2. There can be **only one owner** at a time.
3. When the owner goes out of **scope**, the value is **dropped**: Rust automatically calls the function `drop`, which frees the memory.

A scope is the region of the program in which a variable is valid, typically delimited by braces `{ }`. The third rule is a form of the C++ pattern *Resource Acquisition Is Initialization* (RAII): the lifetime of a resource is tied to the lifetime of a variable.

### `String` and string literals (Example 1)

```rust
let s1 = "hello";                     // string literal, type &str
let mut s2 = String::from("hello");   // String, data on the heap
s2.push_str(", world!");
```

A **string literal** is known at compile time; its text is stored directly in the executable, in read-only memory, and `s1` contains only its address and length. It is therefore fast, but immutable. A **`String`** can grow at run time, so its text must be stored on the heap. A `String` consists of three fields stored on the stack: a pointer to the heap buffer, the length (number of bytes in use) and the capacity (number of bytes allocated):

```
         stack                      heap
   s2 ┌──────────┬───┐          ┌───┬───┬───┬───┬───┐
      │ ptr      │ ●─┼────────► │ h │ e │ l │ l │ o │
      │ len      │ 5 │          └───┴───┴───┴───┴───┘
      │ capacity │ 5 │
      └──────────┴───┘

   s1 ┌──────────┬───┐          executable (read-only)
      │ ptr      │ ●─┼────────► "hello"
      │ len      │ 5 │
      └──────────┴───┘
```

*Figure 1. A `String` and a string literal holding the same text (after Figure 4-1 of [6]).*

`String::from` **allocates** the buffer. `push_str` may reallocate it when the capacity is insufficient; this is why `s2` must be declared `mut`. The buffer is freed when `s2` goes out of scope.

### Move (Example 2)

```rust
let s3 = s2;
// println!("{s2}");   // error[E0382]: borrow of moved value: `s2`
```

The assignment copies the three fields stored on the stack, but **not** the data on the heap. If both variables remained valid, both would free the same buffer when going out of scope, which is a *double free*. Rust therefore considers that the value has been **moved**: `s3` becomes the owner, and `s2` can no longer be used.

```
   s2 ┌─────────────┐
      │ (moved)     │ ╳  no longer usable
      └─────────────┘
                              ┌───┬───┬───┬───┬───┐
   s3 ┌──────────┬───┐   ┌──► │ h │ e │ l │ l │ o │ ...
      │ ptr      │ ●─┼───┘    └───┴───┴───┴───┴───┘
      │ len      │13 │
      │ capacity │ … │
      └──────────┴───┘
```

*Figure 2. After `let s3 = s2;` only `s3` owns the buffer (after Figures 4-2 and 4-4 of [6]).*

In languages such as Java or Python, this assignment would be a **shallow copy**: two references to the same object. In Rust, it is a move, which is a shallow copy followed by the invalidation of the source. A **deep copy**, which duplicates the data on the heap, must be requested explicitly with `let s3 = s2.clone();`. Rust thus never makes an expensive copy implicitly: any call to `clone` is visible in the code.

### Assigning a new value (Example 3)

```rust
let mut s4 = String::from("hello");
s4 = String::from("HELLO");
```

When a new value is assigned to a variable that already owns a value, the old value has no owner any more, and Rust calls `drop` on it **immediately**:

```
   s4 ┌─────┐       ┌───────┐
      │  ●──┼──╳──► │ hello │   dropped at the assignment
      │     │       └───────┘
      │     │       ┌───────┐
      │  ●──┼─────► │ HELLO │
      └─────┘       └───────┘
```

*Figure 3. Reassignment drops the previous value (after Figure 4-5 of [6]).*

The compiler warns that the first value is never read (`unused_assignments`), which is correct in this deliberately minimal example.

### Copy types (Example 4)

```rust
let x = 5;
let y = x;      // x remains valid
```

Integers have a known, fixed size and are stored entirely on the stack, so copying them is as cheap as moving them; there is no reason to invalidate `x`. Such types implement the trait **`Copy`**: an assignment copies the value, and the source remains valid. A type can implement `Copy` only if it requires no special action when it is dropped. As a rule, any group of simple scalar values can be `Copy`, and nothing that requires allocation or represents a resource can be:

| `Copy` | not `Copy` |
|---|---|
| integers (`i32`, `u32`, …), floating-point numbers, `bool`, `char` | `String`, `Vec<T>`, `Box<T>` |
| shared references `&T` | mutable references `&mut T` |
| tuples and arrays of `Copy` types, e.g. `(i32, i32)` | tuples containing a non-`Copy` type, e.g. `(i32, String)` |

### Ownership and functions (Examples 5 and 6)

Passing a value to a function follows the same rules as assignment: the value is **moved** or **copied**.

```rust
let s = String::from("hello");
takes_ownership(s);      // s is moved into the function
// println!("s={s}");    // error[E0382]: s is no longer valid
let x = 5;
makes_copy(x);           // x is copied; it remains valid
```

The parameter `some_string` of `takes_ownership` becomes the owner of the string; at the end of the function it goes out of scope and the string is freed. The parameter of `makes_copy` receives a copy of `x`, and nothing special happens at the end.

Returning a value also transfers ownership (Example 6): `gives_ownership` moves the `String` it creates to its caller, and `takes_and_gives_back` receives a `String` and moves it back. Transferring ownership into every function and back would be tedious; Rust provides **references** for this purpose. (The compiler warns that `s1` and `s3` of Example 6 are never used.)

### References and borrowing (Example 7)

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

let len = calculate_length(&s1);
```

The expression `&s1` creates a **reference** to `s1`: a pointer to the value, which does not own it. The action of creating a reference is called **borrowing**. When `s` goes out of scope at the end of the function, nothing is dropped, because `s` owns nothing; `s1` remains valid after the call.

```
      s (in calculate_length)        s1 (in main)                heap
      ┌─────┬───┐              ┌──────────┬───┐          ┌───┬───┬───┬───┬───┐
      │ ptr │ ●─┼────────────► │ ptr      │ ●─┼────────► │ h │ e │ l │ l │ o │
      └─────┴───┘              │ len      │ 5 │          └───┴───┴───┴───┴───┘
       borrows                 │ capacity │ 5 │
                               └──────────┴───┘
                                    owns
```

*Figure 4. `&s1` points to the owner, not to the data (after Figure 4-6 of [6]).*

A reference is guaranteed to point to a valid value of a particular type for the whole life of the reference. Like variables, references are **immutable by default**: the commented line `s.push_str("hello world")` in `calculate_length` would fail with `error[E0596]: cannot borrow *s as mutable, as it is behind a & reference`.

### Mutable references (Examples 8 and 9)

A function that must modify a borrowed value receives a **mutable reference**, `&mut String`. Both the variable and the reference must be declared mutable:

```rust
let mut s = String::from("hello");
change(&mut s);
```

The compiler enforces the following **borrowing rules**. At any given time, a value may have **either**

- **any number of immutable references** `&T`, **or**
- **exactly one mutable reference** `&mut T`,

but not both. These rules prevent **data races** at compile time. A data race occurs when two or more pointers access the same data at the same time, at least one of them writes, and the accesses are not synchronised; its effects are undefined and difficult to reproduce. A reader is also protected from a writer changing the data under it.

The scope of a reference extends from the place where it is created to the place where it is **last used**, not to the end of the block (*non-lexical lifetimes*). This is why Example 9 compiles:

```
   let r1 = &s;             ──┐ r1
   let r2 = &s;             ──┼──┐ r2           two immutable borrows: allowed
   println!("{r1} and {r2}"); ──┘──┘            last use of r1 and r2
   let r3 = &mut s;         ──┐ r3              no other borrow is live: allowed
   println!("{r3}");        ──┘
```

*Figure 5. The lifetimes of the references in Example 9 do not overlap.*

If `r1` were used after `r3` was created, the scopes would overlap and the program would be rejected. The table summarises the errors produced by violations of the rules:

| Code | Error | Cause |
|---|---|---|
| E0382 | borrow of moved value | use of a variable after its value was moved (Examples 2, 5) |
| E0596 | cannot borrow as mutable | modification through an immutable reference (Example 7) |
| E0499 | cannot borrow as mutable more than once at a time | two live mutable references |
| E0502 | cannot borrow as mutable because it is also borrowed as immutable | a mutable reference while an immutable one is live (Example 11) |
| E0106 | missing lifetime specifier | a returned reference with no value to refer to (Example 10) |

### Dangling references (Example 10)

A **dangling pointer** refers to memory that has been freed, possibly reused for other data. In Rust, the compiler guarantees that this cannot happen with references. The commented version of `dangle`:

```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s
}   // s goes out of scope and is dropped; &s would point to freed memory
```

is rejected with `error[E0106]: missing lifetime specifier`: the function returns a reference, but there is no value whose lifetime the reference could be tied to. The correct solution, used in the file, is to return the `String` itself, which **moves** ownership to the caller.

### Slices (Example 11)

A **slice** is a reference to a contiguous sequence of elements of a collection, rather than to the whole collection [7]. A **string slice**, of type `&str`, refers to a part of a `String`:

```rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
```

The range `[start..end]` includes `start` and excludes `end`; `[..5]`, `[6..]` and `[..]` omit the first index, the last index, or both. Internally, a slice stores a pointer to its first byte and its length:

```
                                     index:  0   1   2   3   4   5   6   7   8   9  10
   s     ┌──────────┬────┐               ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
         │ ptr      │ ●──┼─────────────► │ h │ e │ l │ l │ o │   │ w │ o │ r │ l │ d │
         │ len      │ 11 │               └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
         │ capacity │ 11 │                 ▲                       ▲
         └──────────┴────┘                 │                       │
   hello ┌─────┬───┐                       │                       │
         │ ptr │ ●─┼───────────────────────┘                       │
         │ len │ 5 │                                               │
         └─────┴───┘                                               │
   world ┌─────┬───┐                                               │
         │ ptr │ ●─┼───────────────────────────────────────────────┘
         │ len │ 5 │
         └─────┴───┘
```

*Figure 6. Two string slices referring to parts of the same `String` (after Figure 4-7 of [7]).*

The function `first_word` traverses the bytes of the string (`as_bytes`, `iter`, `enumerate`) and returns the slice up to the first space, or the whole string if there is none. A slice is an **immutable borrow** of the string. The commented call `s.clear()` needs a **mutable** borrow of `s` while `word` is still in use in the following `println!`, and is rejected with `error[E0502]`. Without slices, `first_word` would return an index, which would silently become meaningless after `clear`; with slices, the inconsistency becomes a compile-time error. (Because `s.clear()` is commented out, the compiler also warns that `s` does not need to be `mut`.)

String literals are slices: the type of `"hello"` in Example 1 is `&str`, a slice that points into the executable, which explains why literals are immutable. A function that only reads a string is usually declared as `fn first_word(s: &str) -> &str`, so that it accepts both a `&String` (converted automatically) and a literal.

## Solana

Solana is a public blockchain designed for high throughput and low latency. Its programs (the Solana term for smart contracts) are compiled to sBPF bytecode, usually from Rust [8]. This section presents two concepts that distinguish Solana from Ethereum: **Proof of History**, the mechanism that gives the network a shared notion of time, and the **account model**, the way the state is organised and protected.

### Proof of History (PoH)

#### Basic concepts

In a distributed system, nodes do not share a clock. Their local clocks drift, and messages are delayed by unpredictable amounts of time, so a node cannot know the order of events produced elsewhere without exchanging messages. Classical consensus protocols spend a large part of their communication establishing this order. **Proof of History** is a cryptographic clock: a sequence of computations that proves that a certain amount of time has elapsed between events, and therefore establishes their order, before any message is exchanged [9].

PoH is a **sequential hash chain**. Starting from an initial value, the hash function SHA-256 is applied repeatedly to its own output, and a counter records the number of applications:

```
   count:     1              2              3                       4
           ┌──────┐       ┌──────┐       ┌───────────────┐       ┌──────┐
   h0 ───► │  h1  │ ────► │  h2  │ ────► │      h3       │ ────► │  h4  │ ───► …
           └──────┘       └──────┘       └───────────────┘       └──────┘
         sha256(h0)     sha256(h1)     sha256(h2 ‖ tx)          sha256(h3)
                                              ▲
                                       transaction tx is
                                       mixed into the chain
```

*Figure 7. A PoH sequence. An event mixed into the chain at count 3 is proved to have occurred after h2 and before h4.*

The construction relies on two properties of a cryptographic hash function:

- **The output cannot be predicted.** The only way to obtain `h_n` is to compute `h_1, …, h_{n-1}` in order. Since each step depends on the previous one, the computation cannot be parallelised; a long chain therefore proves that real time was spent producing it. The rate of a single CPU core is the same order of magnitude on all modern hardware, so the count of hashes serves as a measure of time.
- **Data can be mixed in.** When the hash of an event (for example, a transaction) is included in the input of a step, `h_{n+1} = sha256(h_n ‖ event)`, the event is proved to have been recorded **after** `h_n`, which it could not have predicted, and **before** all subsequent hashes, which depend on it.

The node that produces the chain is the **leader**. The time of the network is divided into **slots**, with a target duration of about 400 ms. In each slot, a single leader, chosen in advance according to its stake, runs the PoH sequence, mixes the transactions it receives into it, and emits periodic markers called **ticks** (64 per slot); a sequence of 432,000 slots, about two days, forms an **epoch**. The **leader schedule** of an epoch is computed in advance, so every node knows which validator is the leader of each slot.

PoH is **not** a consensus mechanism by itself. It does not decide which chain is valid and does not protect against Sybil attacks; these functions are provided by **Proof of Stake**, in which validators vote with a weight proportional to the SOL staked with them. PoH only provides the order of the transactions and a common measure of time to the consensus protocol.

#### Why it scales

- **Asymmetric cost: sequential generation, parallel verification.** Generating a chain of `n` hashes takes `n` sequential steps, but verifying it does not. The chain is split into segments; since the first and last hash of every segment are recorded, each segment can be recomputed independently, on a separate CPU core or GPU thread. A second of PoH produced by one core can thus be verified in a fraction of a second by a machine with many cores.

  ```
     generation (1 core):   h0 ─► … ─► h1000 ─► … ─► h2000 ─► … ─► h3000

     verification:          core 1:  h0    ─► … ─► h1000   ✓
                            core 2:  h1000 ─► … ─► h2000   ✓   (in parallel)
                            core 3:  h2000 ─► … ─► h3000   ✓
  ```

  *Figure 8. A PoH sequence is verified in parallel, segment by segment.*

- **Ordering without communication.** The order and the timing of the transactions are contained in the data of the block. Validators do not exchange messages to agree on them; they verify the PoH sequence and execute the transactions in the order it establishes.
- **Streaming of blocks.** Because the order is fixed by the leader as it goes, the leader does not wait for the end of its slot: it splits the block into small pieces (*shreds*) and transmits them while the slot is in progress, through a tree of validators (**Turbine**). Validators can verify and execute the block incrementally.
- **No global mempool.** Since the leader schedule is known in advance, clients and validators forward transactions directly to the current and the next leaders (**Gulf Stream**), instead of broadcasting them to the whole network.
- **A clock for consensus.** In the consensus protocol Tower BFT, a vote of a validator for a block commits it not to vote for a conflicting fork for a period that doubles with each confirming vote (*lockout*). These periods are measured in PoH time, so no additional synchronisation is required.

**Recent evolution.** On 21 October 2026, at the start of epoch 1064, Solana activated on mainnet the first phase of **Alpenglow** (SIMD-0326), a new consensus protocol [10, 11, 12]. Its voting component, **Votor**, replaces Tower BFT and its on-chain vote transactions with certificates formed from aggregated BLS signatures, with a target finality of about 150 ms instead of about 12.8 s. The design removes PoH from consensus: slots have a fixed duration of about 400 ms, with local timeouts, instead of being measured by a PoH chain. Block propagation through Turbine is unchanged in this phase; its replacement, **Rotor**, has no announced date. The ideas presented above remain necessary to understand the architecture of Solana and the large body of existing documentation and code that refers to PoH, but the details of the transition should be checked against the current documentation.

### The account model and account ownership

#### Accounts

All the state of Solana is stored in **accounts**, organised as a key–value store: the key is the **address** of the account, a 32-byte value usually displayed in Base58, and the value is the account itself [13]. Every account has the same structure:

```
   address (32 bytes)  ──►  ┌─────────────┬──────────────────────────────────────────┐
                            │ lamports    │ balance; 1 SOL = 10^9 lamports           │
                            │ data        │ byte array (up to 10 MiB)                │
                            │ owner       │ address of the program that owns it      │
                            │ executable  │ true if the account contains a program   │
                            │ rent_epoch  │ legacy field                             │
                            └─────────────┴──────────────────────────────────────────┘
```

*Figure 9. The fields of a Solana account.*

The address of most accounts is an Ed25519 **public key**; whoever holds the corresponding private key can sign transactions on behalf of the account. Every account must hold a minimum balance proportional to the size of its data, the **rent-exempt minimum**, which pays for the storage that every validator must keep; the balance is recovered when the account is closed.

The essential difference from Ethereum is the **separation of code and state**. In the EVM, a contract account contains both its code and its storage. On Solana, **programs are stateless**: a program is an account with `executable = true` whose data contains its bytecode, and the state on which it operates is stored in **other accounts**, owned by the program. The same program can therefore manage any number of state accounts, for example one account per user.

#### Account ownership

The field `owner` contains the address of the **program** that owns the account. The runtime enforces the following rules on every transaction [13, 14]:

1. **Only the owner program can modify the data** of an account.
2. **Only the owner program can debit lamports** from an account. **Any** program can credit lamports to an account.
3. **Only the owner can assign the account to another owner**, and only while its data is zero-initialised (so that a new owner never receives data it did not write).
4. A program can modify an account only if the transaction has marked it as **writable**.

Ownership by a program must be distinguished from control by a user. A user's wallet is an account owned by the **System Program** (address `11111111111111111111111111111111`). The System Program allows its lamports to be debited only by a transaction **signed** with the private key of the account. The user therefore controls the wallet through a signature, while the System Program owns it and enforces the rules.

```
       ┌─────────────────────────┐
       │ System Program          │  executable
       └───────────▲─────────────┘
                   │ owner
       ┌───────────┴─────────────┐
       │ Wallet of Alice         │  lamports: 5 SOL; data: empty
       │ (address = public key)  │  debited only with Alice's signature
       └─────────────────────────┘

       ┌─────────────────────────┐            ┌─────────────────────────┐
       │ Loader (BPF Loader)     │◄── owner ──┤ Counter program         │  executable;
       └─────────────────────────┘            │                         │  data: bytecode
                                              └───────────▲─────────────┘
                                                          │ owner
                                    ┌─────────────────────┴───┬─────────────────────────┐
                                    │ Counter of Alice        │ Counter of Bob          │
                                    │ data: count = 3         │ data: count = 7         │
                                    └─────────────────────────┴─────────────────────────┘
                                     modified only by the Counter program
```

*Figure 10. Owners of accounts: wallets are owned by the System Program, programs by a loader, and the state accounts of a program by the program itself.*

New accounts are created by the System Program, which allocates the space, funds the account with the rent-exempt minimum, and assigns it to the requested owner. Programs themselves are accounts owned by a **loader** program, which verifies and deploys their bytecode. Programs also own accounts whose addresses are **Program Derived Addresses** (PDAs), derived deterministically from the address of the program and from chosen *seeds* (for example, the string `"counter"` and the address of the user). A PDA has no private key; the program from which it is derived can authorise operations on its behalf, which allows a program to control assets without any user holding a key.

The same model is used by the standard programs: the token balances of a user, for example, are stored in **token accounts** owned by the Token Program, which alone can modify them, according to instructions signed by the user.

#### Accounts and parallel execution

Every Solana transaction lists **in advance** all the accounts it will read or write, and marks each of them as writable or read-only, and as signer or not. The runtime (**Sealevel**) uses this information to execute in parallel the transactions that do not conflict, which is not possible in the EVM, where the slots accessed by a transaction are known only after it has been executed. The rule applied by Sealevel to each account is the borrowing rule of Rust, applied to transactions instead of references:

| Rust | Sealevel |
|---|---|
| any number of immutable references `&T` | any number of transactions that read an account, in parallel |
| exactly one mutable reference `&mut T` | exactly one transaction that writes an account at a time |
| no `&mut T` while a `&T` is live | a transaction that writes an account waits for those that read it |

Two transfers between four distinct wallets are executed simultaneously, whereas two transactions that both write the counter of Alice are executed one after the other. The throughput of Solana thus depends not only on PoH, but also on the design of the programs: a program that makes every transaction write a single global account serialises all of them.

## References

1. S. Klabnik, C. Nichols, C. Krycho, *The Rust Programming Language*, Chapter 2, *Programming a Guessing Game*. https://doc.rust-lang.org/stable/book/ch02-00-guessing-game-tutorial.html
2. *The Rust Programming Language*, Section 1.1, *Installation*. https://doc.rust-lang.org/stable/book/ch01-01-installation.html
3. *The Rust Programming Language*, Section 1.2, *Hello, World!*. https://doc.rust-lang.org/stable/book/ch01-02-hello-world.html
4. *The Rust Programming Language*, Section 20.5, *Macros*. https://doc.rust-lang.org/stable/book/ch20-05-macros.html
5. *The Rust Programming Language*, Section 1.3, *Hello, Cargo!*. https://doc.rust-lang.org/stable/book/ch01-03-hello-cargo.html
6. *The Rust Programming Language*, Sections 4.1, *What Is Ownership?*, and 4.2, *References and Borrowing*. https://doc.rust-lang.org/stable/book/ch04-01-what-is-ownership.html, https://doc.rust-lang.org/stable/book/ch04-02-references-and-borrowing.html
7. *The Rust Programming Language*, Section 4.3, *The Slice Type*. https://doc.rust-lang.org/stable/book/ch04-03-slices.html
8. Solana documentation, *Programs*. https://solana.com/docs/core/programs
9. A. Yakovenko, *Solana: A new architecture for a high performance blockchain*, whitepaper v0.8.13. https://solana.com/solana-whitepaper.pdf
10. Solana, *Alpenglow*. https://solana.com/upgrades/alpenglow
11. Helius, *Alpenglow: Solana's Great Consensus Rewrite*. https://www.helius.dev/blog/alpenglow
12. TokenPost, *Solana Sets Alpenglow Mainnet Activation for Oct. 21, 2026*. https://www.tokenpost.com/news/technology/34321
13. Solana documentation, *Solana Account Model*. https://solana.com/docs/core/accounts
14. Solana documentation, *Program Derived Address*. https://solana.com/docs/core/pda

Additional resources:

- [The Rust Programming Language](https://doc.rust-lang.org/stable/book/) and [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [The Cargo Book](https://doc.rust-lang.org/cargo/)
- [Documentation of the crate `rand`](https://docs.rs/rand/)
- [Solana documentation](https://solana.com/docs)

> **Note on the preparation of this document.** Parts of this lecture were drafted with the assistance of Claude (Anthropic), an AI assistant.
