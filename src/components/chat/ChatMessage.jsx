import { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MarkdownCode from "../markdown/MarkdownCode";
import { useChat } from "../../contexts/ChatContext";

export default function ChatMessage({

  message,

  isUser,

  onRetry,

}) {

  const [copied, setCopied] = useState(false);
const { user } = useChat();
  async function copy() {

    await navigator.clipboard.writeText(message);

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 1500);

  }

  return (

<motion.div

initial={{

opacity:0,

y:18,

}}

animate={{

opacity:1,

y:0,

}}

transition={{

duration:.22,

}}

className={`
group
mb-5

flex

w-full

${

isUser

?

"justify-end"

:

"justify-start"

}

`}

>

{/* Assistant Avatar */}

{!isUser && (

<div

className="

mr-4

mt-1

flex

h-9

w-9

shrink-0

items-center

justify-center

rounded-bl-md

bg-gradient-to-br

from-blue-600

to-sky-400

text-sm

font-semibold

text-white

shadow

"

>

<img
  src="/assets/logo.png"
  alt="Athena"
  className="h-5 w-5"
/>

</div>

)}

<div className="max-w-[720px] flex-1">

{/* Bubble */}

<div

className={`

rounded-3xl

px-5

py-4

leading-7

shadow-[0_2px_10px_rgba(0,0,0,0.05)]

transition

${

isUser

?

"rounded-br-md bg-gradient-to-br from-blue-600 to-sky-500 text-white"

:

"rounded-bl-md border border-slate-200 bg-white text-slate-800"

}

`}

>

<ReactMarkdown

remarkPlugins={[remarkGfm]}

components={{

code:MarkdownCode,

}}

>

{message}

</ReactMarkdown>

</div>

{/* Footer */}

<div

className={`

mt-2

flex

items-center

gap-2

text-xs

text-slate-400

${

isUser

?

"justify-end"

:

"justify-start"

}

`}

>

{!isUser && (

<>

<button

onClick={copy}

className="rounded-lg p-2 transition hover:bg-slate-100"

>

{copied ? (

<Check size={15}/>

) : (

<Copy size={15}/>

)}

</button>

<button

onClick={onRetry}

className="rounded-lg p-2 transition hover:bg-slate-100"

>

<RotateCcw size={15}/>

</button>

<button

className="rounded-lg p-2 transition hover:bg-slate-100"

>

<ThumbsUp size={15}/>

</button>

<button

className="rounded-lg p-2 transition hover:bg-slate-100"

>

<ThumbsDown size={15}/>

</button>

</>

)}

{isUser && (

<span>

You

</span>

)}

</div>

</div>

{/* User Avatar */}

{isUser && (

<div

className="

ml-4

mt-1

flex

h-9

w-9

shrink-0

items-center

justify-center

rounded-full

bg-slate-900

text-sm

font-semibold

text-white

"

>

K

</div>

)}

</motion.div>

  );

}