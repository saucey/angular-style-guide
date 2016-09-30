export const template = `
<button (click)="coll('box1')">one</button>
<button (click)="coll('box2')">two</button>
<button (click)="coll('box3')">three</button>

    {{visibility.one}}
    {{visibility.two}}
    {{visibility.three}}
    
    <div [@visibility]="visibility.one">
      <div style="background-color: red; padding: 20px; box-sizing: border-box;">
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
        <button class="arrow" disabled type="button" (click)="save(personInfo)">Volgende vraag</button>
      </div>
    </div>
    
    <div [@visibility]="visibility.two">
      <div style="background-color:  green; padding: 20px; box-sizing: border-box;">
        Animate good times! box1 Come on!
      </div>
    </div>
    
    <div [@visibility]="visibility.three">
      <div style="background-color:  blue; padding: 20px; box-sizing: border-box;">
        Animate good times! box1 Come on!
      </div>
    </div>
    
`;
