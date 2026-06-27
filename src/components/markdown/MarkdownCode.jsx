import { useState } from "react";

import { Copy, Check } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownCode({

    inline,

    className,

    children,

    ...props

}){

    const [copied,setCopied]=useState(false);

    const code=String(children).replace(/\n$/,"");

    const match=/language-(\w+)/.exec(className||"");

    async function handleCopy(){

        await navigator.clipboard.writeText(code);

        setCopied(true);

        setTimeout(()=>setCopied(false),1500);

    }

    if(inline){

        return(

            <code

                className="

px-1.5

py-0.5

rounded

bg-slate-100

text-blue-700

font-mono

text-[14px]

"

                {...props}

            >

                {children}

            </code>

        );

    }

    return(

<div

className="

group

my-4

overflow-hidden

rounded-2xl

border

border-slate-200

"

>

<div

className="

flex

items-center

justify-between

bg-slate-50

px-4

py-2

border-b

border-slate-200

"

>

<span

className="

text-xs

uppercase

tracking-wider

text-slate-500

"

>

{match?.[1]||"text"}

</span>

<button

onClick={handleCopy}

className="

rounded-lg

p-2

transition

hover:bg-slate-200

"

>

{

copied

?

<Check

size={16}

/>

:

<Copy

size={16}

/>

}

</button>

</div>

<SyntaxHighlighter

language={match?.[1]}

style={oneLight}

customStyle={{

margin:0,

padding:"20px",

background:"#ffffff",

fontSize:"14px",

lineHeight:1.7

}}

showLineNumbers

PreTag="div"

{...props}

>

{code}

</SyntaxHighlighter>

</div>

    );

}