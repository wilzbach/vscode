# comment

###
comment block
###

a = 1 # inline comment

###
comment block with annotations
@argument description
###

import 'folder/folder' as blanket


# types
int
string
regex
function
null
boolean
map
list
any
object


# keywords
true
false
and
null
when
return
returns
as
foreach
while
if
else  # also used as else if
try
catch


###
Call an object
`command` is required
`key` are unique and can be indented
`:lorem` is short for `lorem:lorem` 
###
service command key:value :lorem

service command key:value
               :lorem

# can also be assigned
foobar = service command key:value

# Service can also lead with `/`
my/service command

###
Mutation
`variable command *args`
###
a = "hello"
res = a split by: "hello"

###
Functions
`function name *args [returns type]?`
if returns then must return
###
function foobar key: "value" returns int
    return 1

# can return nothing
function foobar
    a = 1

###
Event context
object->command->event
###
http server as client
	when client listen path: /foo/g as req
		# ...

# inline
when http server listen path: "/hello" as req
    # ...

# Loops
foreach array as output
	# ...

while a > 1
    # ...

# Conditions
if 0.1 >= 1 and true or null: 
	# ...

if (a and b) or 1 > 2:
	# ...

# Map
map = {"foo": "bar"}
map = {
	key: value
}

# List
list = [0, 1, 3]
list = [
	0,
	1,
	2, 3, "hello world"
]

# Regex
a = /pattern/gim

# Accessing properties
a = foo.bar    # object property
a = foo['bar'] # map attribute
a = foo[0]     # list item

# Long Strings
a = """
Hello world
"""

# String variables
a = "... {something} ..."
