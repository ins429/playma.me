import React from 'react'

const Char = props => <div className="uppercase pulse" {...props} />

//   display: inline-block;
//   text-transform: uppercase;
//   animation-name: ${pulse};
//   animation-duration: ${({ animationDuration = 5 }) => animationDuration}s;
//   animation-fill-mode: both;
//   animation-iteration-count: infinite;
//   animation-delay: ${({ delay = 0 }) => delay}s;
//

const TextLoader = ({ text = 'loading', ...props }) => (
  <div {...props}>
    {text.split('').map((char, index, ary) => (
      <Char
        key={index}
        delay={index * 0.3}
        animationDuration={ary.length * 0.3 * 2}
      >
        {char}
      </Char>
    ))}
  </div>
)

export default TextLoader
