'use strict'

const htmlstate = require('./htmlstate')

const hstate = new htmlstate()

let testdata = [
  `<x-image
    src="a.png"></x-image>`,

  `<input type="text" value="\\"a\\"">`,

  `<input type="text" value="==>">`,

  `<x-a cn='""'></x-a>`,

  `<x-a cn=\\'OK\\'></x-a>`,

  `<div container row>
  <div md-0-5 lg-0-5></div>
  <div sm-12 md-11 lg-11 style="margin-top:0.25rem; height: 29vh;background: #f1f2f3;"></div>
  <div md-0-5 lg-0-5></div>
</div>

<div container row style="height: 67vh;margin-top: 0.5rem;">
  <div md-0-5 lg-0-5></div>
  <div sm-12 md-11 lg-11>
    <div data-name="methods" padding row></div>
    <form data-onsubmit="request" style="width: 100%;">
      <div row>
        <div sm-12 md-5 lg-4>
          <div><input type="text" name="url" placeholder="请求路径"></div>
          <textarea name="headers" id="" cols="30" rows="10" 
            placeholder="消息头，格式： x-key: 1234" 
            mtop></textarea>
            <div data-name="bodybox"></div>
        </div>
        
        <div sm-12 md-7 lg-8 style="padding: 0 0.258rem;">
          <textarea name="request-result" id="" cols="30" rows="10" placeholder="请求结果"></textarea>
          <div row mtop>
            <div cell>
              <button data-onclick="history">历史请求</button>
            </div>

            <div cell>
              <input type="submit" value="==>">
            </div>
          </div>
          
        </div>
      </div>
    </form>
  </div>
  <div md-0-5 lg-0-5></div>
  
</div>
`
]

testdata.forEach(x => {
  if (!hstate.parse(x)) {
    console.log(x, hstate.lastErrorMsg)
  }
})
