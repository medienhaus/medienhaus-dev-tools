<img src="./public/favicon.svg" width="70" />

### medienhaus/

Customizable, modular, free and open-source environment for decentralized, distributed communication and collaboration without third-party dependencies.

[Website](https://medienhaus.dev/) — [Fediverse](https://chaos.social/@medienhaus)

<br>

# medienhaus-dev-tools 🔧

Development and maintenance tools for matrix rooms and spaces.

`/leave` lets you leave every space or room with a given name. <br>
`/space` event lets you add a state event with a given name to a given room. <br>
`/createStructure` lets you create a nested matrix spaces tree based on a json file <br>

## Static Next.js React front-facing interface

### Deployment as static website

Clone git repository and run `npm run build`.
<br>
This will create a folder called 'out' with the static website

### Installation

#### `npm install`

Installs all of the application’s dependencies.

### Configuration

Configuration happens in the `next.config.js` file.

### Available scripts

In the project directory, you can run:

#### `npm run dev`

Runs the application in the development mode.
<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
<br>
You will also see any lint errors in the console.

#### `npm run export`

Builds a production-ready version of the application and exports it to the `out` directory.
<br>
The build is minified and the filenames include the hashes.

### Notes

When wrapping a [`<Link>`](https://nextjs.org/docs/api-reference/next/link) from `next/link` within a styled-component, the [`as`](https://styled-components.com/docs/api#as-polymorphic-prop) prop provided by `styled` will collide with the Link's `as` prop and cause styled-components to throw an `"Invalid tag"` error. To avoid this, you can either use the recommended [`forwardedAs`](https://styled-components.com/docs/api#forwardedas-prop) prop from styled-components or use a different named prop to pass to a `styled` Link.

<details>

<summary>Click to expand workaround example</summary>

<br>

**components/StyledLink.js**

```javascript
import Link from 'next/link'
import styled from 'styled-components'

const StyledLink = ({ as, children, className, href }) => (
  <Link href={href} as={as} passHref>
    <a className={className}>{children}</a>
  </Link>
)

export default styled(StyledLink)`
  color: #0075e0;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #40a9ff;
  }

  &:focus {
    color: #40a9ff;
    outline: none;
    border: 0;
  }
`
```

**pages/index.js**

```javascript
import StyledLink from '../components/StyledLink'

export default () => (
  <StyledLink href="/post/[pid]" forwardedAs="/post/abc">
    First post
  </StyledLink>
)
```

</details>

### create Structure

The Create Structure Route is expecting a json file as an array of objects with following keys :
* name – String
* template – String
* type – String
* parentNames – Array of Strings
* persons – Array of Objects
    * name – String
    * mail – String

Example:

```
[
  {
    "name": "root context name",
    "template": "root",
    "type": "context",
    "parentNames": [
      ""
    ],
    "persons": [
      {
        "name": "Firstname Lastname",
        "mail": "firstname-lastname@example.org"
      }
    ]
  },
  {
    "name": "sub context name",
    "template": "sub",
    "type": "context",
    "parentNames": [
      "root context name"
    ],
    "persons": [
      {
        "name": "Some-Other Name",
        "mail": "some-other-name@example.org"
      }
    ]
  }
]
```

<br>

## CLI Tools

### `createStructure` CLI Tool

### Usage

1. Clone or download the repository.
2. Install Node.js.
3. Run the tool with your structure file, matrix base_url, matrix server_name, and access_token.

```bash
node ./cli/createStructure.js \
  -f ./examples/structure.example.json \
  -b https://matrix.example.org \
  -s example.org \
  -t syt_access_token_foo_bar_baz_etc_lorem_ipsum \
```

4. The tool will create the nested matrix spaces based on the input data.
5. The output JSON can be used for further usage.

For help, use:

```bash
node ./cli/createStructure.js -h
```
