---
{
title: 'Understanding map, filter, and zip in Python',
description: 'Understand how map, filter, and zip work in Python to apply logic to data structures without nesting loops.',
published: '2021-11-13T05:12:03.284Z',
tags: ['python', 'beginner', 'data-structures', 'map', 'filter', 'list'],
}
---

# Understanding map, filter, and zip in Python

The purpose of this article is to understand how Python built-in functions map(), filter(), and zip() work to make you more efficient with processing data in Python!

I will go over how these functions work and provide use-cases with and without the functions to compare.

It is important to understand how these functions work, but there is a better way once you're finished reading this! Its called **Comprehensions** and I write about them in *[Beginner Python Comprehensions](https://dev.to/codespent/beginner-python-list-comprehensions-3jp9)*

## Map

> Python's map() function is used to apply a function on all elements of a specified iterable and return a map object.

`map()` will take 2 required positional arguments. 1.) A function to run against iterables. 2.) An iterable (ie. list).

```python
map(func, [...])
```

The expected output of this would be a `map object` with a memory position.

Lets take an example that applies the function `square()` to a list of integers. The objective here is to get a list of squared numbers from our original `numbers` list.

```python
def square(number):
    return number*number
```

```python
numbers = [1,2,3,4,5]
```

### Without map()
```python
def square(number):
    return number*number

numbers = [1,2,3,4,5]
squared_numbers = []

for number in numbers:
    squared = square(number)
    squared_numbers.append(squared)
```

### With map()
```python
def square(number):
    return number*number

numbers = [1,2,3,4,5]
squared_numbers = map(square, numbers)
```

### What we observed:
- Using `map()` we don't need to create an empty list that we append to in a for loop.
- We do not need to use `square()` with parentheses as the function parameter, as `map()` will call the function for us, we just pass the function object.
- `map()` will run `square()` for each item in `numbers`.

## Filter

> Python's filter() function checks a condition of each element in an iterable and returns a filtered data structure only containing elements who match the given conditions.

`filter()` will take 2 required positional arguments. 1.) A function to run against iterables. 2.) An iterable (ie. list).

```python
filter(func, [...])
```

The function passed to `filter()` must return a boolean (`True` or `False`)

The expected output of this would be a `filter object` with a memory position.

Lets take an example that applies the function `even()` to a list of integers. The objective here is to get a list that only contains even numbers.

```python
def even(number):
    return (number  % 2) == 0
```
```python
numbers = [1,2,3,4,5]
```

### Without filter()
```python
def even(number):
    if (number % 2) == 0:
        return True
    return False

numbers = [1,2,3,4,5]

even_numbers = []
for number in numbers:
    if even(number):
        even_numbers.append(number)
```

### With filter()
```python
def even(number):
    if (number % 2) == 0:
        return True
    return False

numbers = [1,2,3,4,5]
even_numbers = filter(even, numbers)
```

### What we observed:
- Using `filter()` we don't need to create an empty list that we append to in a for loop.
- We do not need to use `even()` with parenthesis as the function parameter, as `filter()` will call the function for us, we just pass the function object.
- `filter()` will run `even()` for each item in `numbers` and remove all elements that returned `False`.

## Zip

> Python's zip() function combines elements of 2 lists with matching indexes into an iterable of tuples.

`zip()` will take an undefined number of arguments where each argument is an iterable to zip.

```python
zip([...], [...], [...], ...)
```

The expected output of this would be a `zip object` containing tuples of the same-index element of each iterable with a memory position..

Let's take the above 2 examples combined to create a list of even numbers with their respective squared results.

```python
def even(number):
    if (number % 2) == 0:
        return  True
    return  False

def square(number):
    return number*number

numbers = [1,2,3,4,5]
squared_numbers = list(map(square, numbers))
even_numbers = list(filter(even, numbers))
```

### Without zip()
```python
...
even_numbers = [2,4]
even_numbers_squared = [4, 8]
combined = []
even_numbers_index = 0
for number  in even_numbers:
    squared = even_numbers_squared[even_numbers_index]
    squared_tuple = (number, squared)
    combined.append(squared_tuple)
```

### With zip()
```python
...
even_numbers = [2,4]
even_numbers_squared = [4, 8]
zipped_result = zip(even_numbers, even_numbers_squared)
```

### What we observed:
- Using `zip()` we can combine values with matching indexes from multiple lists without creating a buffer list or iterating with a for loop.


## Conclusion
So hopefully with this you have a basic grasp on how these functions work, why they're useful, and how they can help you write more efficient and more readable Python code!

It is important to understand how these functions work, but there is a better way once you're finished reading this! Its called **Comprehensions** and I write about them in *[Beginner Python Comprehensions](https://dev.to/codespent/beginner-python-list-comprehensions-3jp9)*