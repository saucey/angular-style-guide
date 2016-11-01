export const template = `
  <h2 class="title">{{ data.options.blok1title }}</h2>
  <h3 class="title">{{ blok1aantalTodosChecked }} van {{ blok1aantalTodosTotaal }} {{ data.options.blok1description }}</h3>  
  <p></p>
  <p></p>   
  <div id="faq" class="faq container_12 divider-line">
    <ul class="horizontal visible questions row-fluid">
      <!--faq items iteration start-->
      <div *ngFor="let q of blok1questions"> 
        <li class="field-item">
          <label class="question">
            <input type="radio" name="show" value="0"/>
            <!-- subsequent radio elements need to have incrementing values [1,2,3...,n] in order for the accordeon character to work properly-->
            <h3 class="title">{{ q.title }}</h3>
            <div class="line"></div>
            <div class="answer">
              <div class="faq-answer-inner">
                <div *ngFor="let todo of q.todos">
                  <label class="checkbox">
                    <input type="checkbox" name="{{ todo.code }}" #checkboxName value="{{ todo.code }}" (click)="setValue(checkboxName)"/>
                    <span class="checkbox"></span>{{ todo.name }}
                  </label>
                  <p></p>
                </div>
              </div>
            </div>
          </label>
        </li>
      </div>  
      <!--faq items iteration end--> 
    </ul>
  </div>
  
  <div *ngIf = "getBlok2Visible()">
  <h2 class="title">{{ data.options.blok2title }}</h2>
  <h3 class="title">{{ blok2aantalTodosChecked }} van {{ blok2aantalTodosTotaal }} {{ data.options.blok2description }}</h3>  
  <p></p>
  <p></p>   
  <div id="faq" class="faq container_12 divider-line">
    <ul class="horizontal visible questions row-fluid">
      <!--faq items iteration start-->
      <div *ngFor="let q of blok2questions"> 
        <li class="field-item">
          <label class="question">
            <input type="radio" name="show" value="0"/>
            <!-- subsequent radio elements need to have incrementing values [1,2,3...,n] in order for the accordeon character to work properly-->
            <h3 class="title">{{ q.title }}</h3>
            <div class="line"></div>
            <div class="answer">
              <div class="faq-answer-inner">
                <div *ngFor="let todo of q.todos">
                  <label class="checkbox">
                    <input type="checkbox" name="{{ todo.code }}" #checkboxName value="{{ todo.code }}" (click)="setValue(checkboxName)"/>
                    <span class="checkbox"></span>{{ todo.name }}
                  </label>
                  <p></p>
                </div>
              </div>
            </div>
          </label>
        </li>
      </div>  
      <!--faq items iteration end--> 
    </ul>
  </div>
  </div>
  
    <div *ngIf = "getBlok3Visible()">
    <h2 class="title">{{ data.options.blok3title }}</h2>
  <h3 class="title">{{ blok3aantalTodosChecked }} van {{ blok3aantalTodosTotaal }} {{ data.options.blok3description }}</h3>  
  <p></p>
  <p></p>   
  <div id="faq" class="faq container_12 divider-line">
    <ul class="horizontal visible questions row-fluid">
      <!--faq items iteration start-->
      <div *ngFor="let q of blok3questions"> 
        <li class="field-item">
          <label class="question">
            <input type="radio" name="show" value="0"/>
            <!-- subsequent radio elements need to have incrementing values [1,2,3...,n] in order for the accordeon character to work properly-->
            <h3 class="title">{{ q.title }}</h3>
            <div class="line"></div>
            <div class="answer">
              <div class="faq-answer-inner">
                <div *ngFor="let todo of q.todos">
                  <label class="checkbox">
                    <input type="checkbox" name="{{ todo.code }}" #checkboxName value="{{ todo.code }}" (click)="setValue(checkboxName)"/>
                    <span class="checkbox"></span>{{ todo.name }}
                  </label>
                  <p></p>
                </div>
              </div>
            </div>
          </label>
        </li>
      </div>  
      <!--faq items iteration end--> 
    </ul>
  </div>
  </div>
 
    <div *ngIf = "getBlok4Visible()">
    <h2 class="title">{{ data.options.blok4title }}</h2>
  <h3 class="title">{{ blok4aantalTodosChecked }} van {{ blok4aantalTodosTotaal }} {{ data.options.blok4description }}</h3>  
  <p></p>
  <p></p>   
  <div id="faq" class="faq container_12 divider-line">
    <ul class="horizontal visible questions row-fluid">
      <!--faq items iteration start-->
      <div *ngFor="let q of blok4questions"> 
        <li class="field-item">
          <label class="question">
            <input type="radio" name="show" value="0"/>
            <!-- subsequent radio elements need to have incrementing values [1,2,3...,n] in order for the accordeon character to work properly-->
            <h3 class="title">{{ q.title }}</h3>
            <div class="line"></div>
            <div class="answer">
              <div class="faq-answer-inner">
                <div *ngFor="let todo of q.todos">
                  <label class="checkbox">
                    <input type="checkbox" name="{{ todo.code }}" #checkboxName value="{{ todo.code }}" (click)="setValue(checkboxName)"/>
                    <span class="checkbox"></span>{{ todo.name }}
                  </label>
                  <p></p>
                </div>
              </div>
            </div>
          </label>
        </li>
      </div>  
      <!--faq items iteration end--> 
    </ul>
  </div>
  </div>
  
  
`;
