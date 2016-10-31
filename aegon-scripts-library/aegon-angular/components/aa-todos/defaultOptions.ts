export var defaultOptions = {
  /**
   * LAYOUT & TEXT
   */

  blok1title: "0 tot 3 maanden",
  blok1description: "bekeken, klik op een vraag en vink af wat u al hebt geregeld",
  blok2title: "3 tot 6 maanden",
  blok2description: "bekeken, klik op een vraag en vink af wat u al hebt geregeld",
  blok3title: "6 tot 9 maanden",
  blok3description: "bekeken, klik op een vraag en vink af wat u al hebt geregeld",
  blok4title: "na de zwangerschap",
  blok4description: "bekeken, klik op een vraag en vink af wat u al hebt geregeld",
  questions1: [
    {
      title: "Wilt u straks meer of minder werken?",
      todos: [
        {name: "U heeft wettelijk het recht om ouderschapsverlof op te nemen.", code: "blok1q1todo1"},
        {name: "Kijk in uw arbeidsovereenkomst voor speciale afspraken. Soms krijgt u deels doorbetaald.", code: "blok1q1todo2"},
        {name: "Check hoe het zit met de pensioenopbouw als u of uw partner ouderschapsverlof neemt.", code: "blok1q1todo3"}
      ]
    },
    {
      title: "Inventariseer hoeveel inkomen u straks heeft.",
      todos: [
        {name: "Uw inkomen daalt als u minder gaat werken. ", code: "blok1q2todo1"},
        {name: "Het stijgt omdat u kinderbijslag krijgt. Hoeveel? Dat leest u op svb.nl", code: "blok1q2todo2"},
        {name: "Daar staat ook of u recht heeft op een kindgebonden budget.", code: "blok1q2todo3"}
      ]
    },
    {
      title: "Is uw huis groot genoeg of wilt u verhuizen? ",
      todos: [
        {name: "Kiezen voor minder werken betekent ook dat u later minder hypotheek kunt krijgen.", code: "blok1q3todo1"}
      ]
    },
    {
      title: "Zijn uw verzekeringen up-to-date?",
      todos: [
        {name: "Een overlijdensrisicoverzekering zorgt ervoor dat uw kind niks tekort komt als u of uw partner er plots niet meer is.", code: "blok1q4todo1"},
        {name: "Krijgt u uw eerste kind? Kijk dan eens of u een gezinspakket kunt sluiten. Die zijn vaak goedkoper.", code: "blok1q4todo2"},
        {name: "Worden zwangerschapsyoga of de kosten van een doula vergoed door uw zorgverzekering? ", code: "blok1q4todo3"},
        {name: "Het kan slim zijn om van zorgverzekering te wijzigen. Dat mag altijd per 1 januari. ", code: "blok1q4todo4"}
      ]
    }
    ,
    {
      title: "Welke kinderopvang zit er in de buurt?",
      todos: [
        {name: "Kiest u een gastouder of crèche?", code: "blok1q5todo1"},
        {name: "Voor hoeveel uur per week? Voor 1 dag opvang betaalt u meestal 10 uur. ", code: "blok1q5todo2"},
        {name: "Wat is de uurprijs die de opvang rekent? ", code: "blok1q5todo3"},
        {name: "Reken uit hoeveel kinderopvangtoeslag u krijgt bij de Belastingdienst.", code: "blok1q5todo4"}
      ]
    },
    {
      title: "Handig",
      todos: [
        {name: "Vraag de gratis babydozen aan. Een goede start voor de baby-uitzet!", code: "blok1q6todo1"}
      ]
    }
  ],


  questions2: [
    {
      title: "Kraamzorg en kraampakket aanvragen bij uw zorgverzekeraar",
      todos: [
        {name: "Vraag ook na of u zelf iets betaalt en hoeveel.", code: "blok2q1todo1"},
        {name: "Vraag het kraampakket aan bij uw zorgverzekeraar.", code: "blok2q1todo2"}
      ]
    },
    {
      title: "Zwangerschapsyoga en/of een bevallingscoach?",
      todos: [
        {name: "Zwangerschapsyoga wordt vaak vergoed als u een aanvullende zorgverzekering heeft.", code: "blok2q2todo1"},
        {name: "Kijk eens op de website www.doula.nl of een bevallingscoach iets voor u is. Niet alle zorgverzekeraars vergoeden dit.", code: "blok2q2todo2"}
      ]
    },
    {
      title: "Vraag een zwangerschapsverklaring aan uw verloskundige.",
      todos: [
        {name: "U heeft de verklaring nodig voor uw werkgever.", code: "blok2q3todo1"}
      ]
    },
    {
      title: "Hoe zet u uw zwangerschapsverlof in?",
      todos: [
        {name: "U leest in uw arbeidsovereenkomst of in uw cao waar u precies recht op heeft.", code: "blok2q4todo1"},
        {name: "Wilt u langer thuis zijn? Vraagt u dan eens na of u extra vrije dagen kunt kopen.", code: "blok2q4todo2"}
      ]
    },
    {
      title: "Niet getrouwd? Dan moet de vader het kind erkennen.",
      todos: [
        {name: "Dit is gratis. Wel moet u als toekomstig moeder mee om samen te ondertekenen.", code: "blok2q5todo1"}
      ]
    },
    {
      title: "De babykamer uitzoeken",
      todos: [
        {name: "Reken op zo'n € 300,- aan babykleren en spullen de eerste maanden.", code: "blok2q6todo1"},
        {name: "Op de site van het Nibud ziet u met elke kosten u rekening moet houden.", code: "blok2q6todo2"},
        {name: "Een tweedehands commode of kast kopen is een stuk voordeliger (nieuw kost het al gauw tussen de € 400,- en € 4000,-)", code: "blok2q6todo3"}
      ]
    },
    {
      title: "Hele uitzet zelf kopen voor de baby? Dan betaalt u minimaal € 1250,-",
      todos: [
        {name: "Autostoeltje, kinderwagen, box en draagzak. Als u alles zelf koopt, kost u dat veel geld.", code: "blok2q7todo1"},
        {name: "Veel spullen heeft u maar tijdelijk nodig. Lenen is dan een prima alternatief!", code: "blok2q7todo2"}
      ]
    }
  ],

  questions3: [
    {
      title: "Geboortekaartjes vaak duurder dan gedacht",
      todos: [
        {name: "100 kaartjes kosten gemiddeld zo’n € 400,-.", code: "blok3q1todo1"},
        {name: "Hoeveel kaartjes denkt u nodig te hebben? Veel mensen bestellen te veel kaartjes.", code: "blok3q1todo2"}
      ]
    },
    {
      title: "Een laatste keer samen weg?",
      todos: [
        {name: "Met een baby is het prima op vakantie gaan. Maar veel mensen kiezen ervoor om één keer samen weg te gaan.", code: "blok3q2todo1"}
      ]
    },
    {
      title: "Geeft u een feest of kiest u voor dagelijks een feestje?",
      todos: [
        {name: "Bij een kraamfeest komt alle visite in een keer. Anderen hebben liever elke dag een of twee visites.", code: "blok3q3todo1"},
        {name: "Handig: denk na over een kadolijst en vraag dingen die u echt kunt gebruiken.", code: "blok3q3todo2"}
      ]
    },
    {
      title: "Handig",
      todos: [
        {name: "Kijk eens op www.luierinfo.nl. Luiers altijd voor de laagste prijs.", code: "blok3q4todo1"}
      ]
    }
  ],

  questions4: [
    {
      title: "Bijschrijven van de baby op verzekeringen.",
      todos: [
        {name: "Voor kinderen betaalt u geen extra premie voor de basis zorgverzekering.", code: "blok4q1todo1"},
        {name: "Vraag ook eens na of u een gezinspolis heeft. Die zijn vaak goedkoper.", code: "blok4q1todo2"}
      ]
    },
    {
      title: "Vraag kinderbijslag op tijd aan.",
      todos: [
        {name: "U hoeft alleen het formulier terug te sturen dat u vanzelf toegestuurd krijgt van de SVB.", code: "blok4q2todo1"}
      ]
    },
    {
      title: "Wie zorgt voor uw baby als u en uw partner er plots niet meer zijn?",
      todos: [
        {name: "Heeft u een voogd benoemd?", code: "blok4q3todo1"},
        {name: "Is alles in uw testament goed geregeld?", code: "blok4q3todo2"},
        {name: "Een overlijdensrisicoverzekering geeft uw kind of voogd extra armslag.", code: "blok4q3todo3"}
      ]
    },
    {
      title: "Hoe is het met uw financiën als u arbeidsongeschiktheid wordt?",
      todos: [
        {name: "Een baby maakt uw leven rijker. Maar ook drukker. Dat is best even wennen Bent u zzp-er? Dan is het goed om na te denken wat er gebeurt als u even niet kunt werken.", code: "blok4q4todo1"}
      ]
    },
    {
      title: "Heeft u een spaarpotje als uw kind later gaat studeren?",
      todos: [
        {name: "Begin vroeg, dan betaalt u per maand een lager bedrag.", code: "blok4q5todo1"},
        {name: "Met een depositorekening weet u wat uw kind later kan verwachten.", code: "blok4q5todo2"},
        {name: "Met een beleggersrekening heeft u kans op een hoger eindresultaat.", code: "blok4q5todo3"}
      ]
    }
  ],




};