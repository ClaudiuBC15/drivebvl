-- =====================================================
-- Start Drive BVL — Seed Data
-- =====================================================

-- ===================== CATEGORII =====================
INSERT OR REPLACE INTO categories (id, name, slug, hero_title, hero_subtitle, description, what_you_can_drive, conditions, documents, duration_info, info_note, testimonials, image_url, seo_title, seo_description, sort_order) VALUES
('B1', 'Categoria B1', 'b1',
  'Permis Categoria B1 Suceava',
  'Cvadricicluri — de la 16 ani',
  '["Categoria B1 îți permite să conduci cvadricicluri ușoare și grele înainte de a împlini 18 ani. Este alegerea ideală pentru tinerii care doresc independență în deplasare."]',
  '["Cvadricicluri a căror masă proprie nu depășește 400 kg (550 kg pentru transport mărfuri)", "Putere maximă netă a motorului: max 15 kW", "Nu include masa bateriilor pentru vehicule electrice"]',
  '["Vârsta minimă: 16 ani fără trei luni", "Copie carte (buletin) de identitate", "Apt din punct de vedere medical", "Apt din punct de vedere psihologic", "Acordul scris al părinților (notarial)"]',
  '["Copie carte de identitate", "Aviz medical — apt pentru conducere", "Aviz psihologic", "Acordul notarial al părinților", "Taxă permis auto (89 Lei)"]',
  'Cursul durează minim 4 săptămâni cu 24 ore teorie și 30 ore practică.',
  'Cursul pentru obținerea permisului auto categoria B1 asigură formarea deprinderilor necesare conducerii în siguranță a cvadriciclurilor înainte de împlinirea vârstei de 18 ani.',
  '[{"name": "Alex M.", "text": "Am luat permisul B1 la 16 ani și a fost cea mai bună decizie. Instructorii au fost super răbdători!", "rating": 5}]',
  '/images/cat-b1.png',
  'Categoria B1 Suceava — Permis Cvadricicluri | Start Drive BVL',
  'Obține permisul categoria B1 în Suceava la Start Drive BVL. Cvadricicluri de la 16 ani. Instructori experimentați, rată mare de promovabilitate.',
  1),

('B', 'Categoria B', 'b',
  'Permis Categoria B Suceava',
  'Autoturisme — cel mai popular curs',
  '["Categoria B este cea mai populară categorie de permis auto. Îți oferă libertatea de a conduce autoturisme cu masa totală maximă de 3.500 kg și maximum 8+1 locuri.", "La Start Drive BVL, cursul este structurat profesionist cu instructori dedicați și o flotă modernă de autoturisme Dacia."]',
  '["Autoturisme cu masa totală maximă de 3.500 kg", "Maximum 8 locuri (în afara conducătorului)", "Ansamblu auto + remorcă cu masa remorcii de max 750 kg", "Remorcă peste 750 kg dacă masa totală a ansamblului nu depășește 4.250 kg"]',
  '["Vârsta minimă: 18 ani fără trei luni (17 ani și 9 luni)", "Copie carte (buletin) de identitate", "Apt din punct de vedere medical", "Apt din punct de vedere psihologic"]',
  '["Copie carte de identitate", "Cazier judiciar cu mențiunea EXAMEN AUTO", "Aviz medical — apt pentru conducere", "Aviz psihologic", "Taxă permis auto (89 Lei)"]',
  'Cursul durează cel puțin 4 săptămâni: minim 24 ore pregătire teoretică și 30 ore pregătire practică.',
  'Cursul pentru obținerea permisului auto categoria B durează cel puțin 4 săptămâni, timp în care se efectuează minim 24 de ore de pregătire teoretică (legislație rutieră) și 30 de ore de pregătire practică (conducere auto).',
  '[{"name": "Maria P.", "text": "Am ales Start Drive BVL pentru categoria B și nu am regretat nici o secundă. Am luat permisul din prima!", "rating": 5}, {"name": "Andrei C.", "text": "Instructori foarte profesioniști. Program flexibil, exact cum aveam nevoie pe lângă facultate.", "rating": 5}, {"name": "Elena R.", "text": "Recomand cu căldură! Am venit fără experiență și am plecat cu permisul și multă încredere la volan.", "rating": 5}]',
  '/images/cat-b.png',
  'Categoria B Suceava — Școala de Șoferi Start Drive BVL',
  'Obține permisul auto categoria B în Suceava la Start Drive BVL. Instructori experimentați, flotă modernă Dacia, rată de promovabilitate 95%. Înscrie-te acum!',
  2),

('BE', 'Categoria BE', 'be',
  'Permis Categoria BE Suceava',
  'Autoturism + Remorcă grea',
  '["Categoria BE este necesară pentru a tracta remorci grele cu un autoturism. Ideal pentru cei care transportă rulote, platforme auto sau remorci mari pentru ambarcațiuni."]',
  '["Ansamblu de vehicule cu masa totală peste 4.250 kg", "Autoturism categoria B + remorcă/semiremorcă cu masa max 3.500 kg"]',
  '["Deținător permis auto categoria B", "Copie carte (buletin) de identitate", "Apt din punct de vedere medical", "Apt din punct de vedere psihologic"]',
  '["Copie carte de identitate", "Copie permis auto categoria B", "Aviz medical", "Aviz psihologic", "Taxă permis auto (89 Lei)"]',
  'Cursul cuprinde pregătire practică intensivă cu ansamblu auto + remorcă pe trasee variate.',
  'Acest curs este esențial pentru cei care doresc să tracteze rulote mari, platforme auto sau remorci pentru bărci care depășesc greutatea standard permisă de categoria B.',
  '[{"name": "Dan V.", "text": "Aveam nevoie de BE pentru platforma auto. Curs scurt, instructori pricepuți. Recomand!", "rating": 5}]',
  '/images/cat-be.png',
  'Categoria BE Suceava — Permis Remorcă | Start Drive BVL',
  'Obține permisul categoria BE în Suceava. Tractare rulote și remorci grele. Start Drive BVL — instructori specializați și pregătire completă.',
  3),

('C', 'Categoria C', 'c',
  'Permis Categoria C Suceava',
  'Camioane — carieră profesionistă',
  '["Categoria C îți deschide ușile către o carieră în transportul de mărfuri. Cu acest permis poți conduce vehicule cu masa totală de peste 3.500 kg.", "La Start Drive BVL avem în flotă camioane moderne și instructori specializați pe gabarit depășit."]',
  '["Autovehicule cu masa totală peste 3.500 kg (altele decât autobuze)", "Maximum 8 pasageri în afara conducătorului", "Ansamblu camion + remorcă cu masa remorcii de max 750 kg"]',
  '["Vârsta minimă: 21 ani (sau 18 ani cu atestat CPI)", "Deținător permis auto categoria B", "Copie carte (buletin) de identitate", "Apt din punct de vedere medical și psihologic"]',
  '["Copie carte de identitate", "Copie permis auto categoria B", "Cazier judiciar", "Aviz medical", "Aviz psihologic", "Taxă permis auto (89 Lei)"]',
  'Pregătirea practică este axată pe manevrarea vehiculelor de gabarit depășit, parcări complexe și conducere preventivă.',
  'Pregătirea practică este personalizată și axată pe manevrarea vehiculelor de gabarit depășit, parcări complexe și conducere preventivă în trafic intens.',
  '[{"name": "Ionuț S.", "text": "Am obținut categoria C pentru cariera de șofer profesionist. Pregătire serioasă pe camion real, nu simulatoare.", "rating": 5}]',
  '/images/cat-c.png',
  'Categoria C Suceava — Permis Camion | Start Drive BVL',
  'Obține permisul categoria C în Suceava la Start Drive BVL. Pregătire pe camion modern MAN TGL, instructori specializați transport marfă.',
  4),

('CE', 'Categoria CE', 'ce',
  'Permis Categoria CE Suceava',
  'TIR — Ansamblu camion + remorcă',
  '["Categoria CE este vârful pregătirii pentru transportul de mărfuri. Cu acest permis poți conduce ansambluri camion + semiremorcă (TIR), deschizându-ți calea spre transport internațional."]',
  '["Ansamblu camion (categoria C) + remorcă/semiremorcă cu masa peste 750 kg", "TIR-uri pentru transport intern și internațional"]',
  '["Deținător permis auto categoria C", "Vârsta corespunzătoare categoriei C", "Copie carte de identitate și permis de conducere", "Apt din punct de vedere medical și psihologic"]',
  '["Copie carte de identitate", "Copie permis auto categoria C", "Cazier judiciar", "Aviz medical", "Aviz psihologic", "Taxă permis auto (89 Lei)"]',
  'Cursul include exerciții specifice în poligon (andocare, mers înapoi cu ansamblu) și trasee externe complexe.',
  'Cursul implică exerciții specifice în poligon (andocare, mers înapoi cu ansamblu) și trasee externe complexe destinate transportului de marfă.',
  '[{"name": "Marius T.", "text": "Am luat CE-ul la Start Drive BVL. Exercițiile din poligon m-au pregătit excelent pentru examen. Mulțumesc!", "rating": 5}]',
  '/images/cat-ce.png',
  'Categoria CE Suceava — Permis TIR | Start Drive BVL',
  'Obține permisul categoria CE (TIR) în Suceava. Start Drive BVL — pregătire completă cu ansamblu camion + semiremorcă, instructori profesioniști.',
  5),

('D', 'Categoria D', 'd',
  'Permis Categoria D Suceava',
  'Autobuze — transport persoane',
  '["Categoria D îți permite să conduci autobuze și autocare, deschizându-ți calea spre o carieră în transportul de persoane. Este una dintre cele mai valoroase categorii profesionale."]',
  '["Autobuze cu peste 8 locuri (în afara conducătorului)", "Ansamblu autobuz + remorcă cu masa remorcii de max 750 kg"]',
  '["Vârsta minimă: 24 ani (sau 21 ani cu atestat CPI)", "Deținător permis auto categoria B", "Copie carte (buletin) de identitate", "Apt din punct de vedere medical și psihologic", "Cazier judiciar fără infracțiuni contra siguranței pe drumuri"]',
  '["Copie carte de identitate", "Copie permis auto categoria B", "Cazier judiciar", "Aviz medical", "Aviz psihologic", "Taxă permis auto (89 Lei)"]',
  'Pregătirea include ore de teorie specifice transportului de persoane și practică pe autobuz.',
  'Categoria D este destinată celor care doresc să lucreze ca șoferi de autobuz sau autocar, în transport urban sau interurban.',
  '[{"name": "Vasile L.", "text": "Am ales Start Drive BVL pentru categoria D. Pregătirea a fost completă și profesionistă.", "rating": 5}]',
  '/images/cat-b.png',
  'Categoria D Suceava — Permis Autobuz | Start Drive BVL',
  'Obține permisul categoria D în Suceava la Start Drive BVL. Transport persoane, autobuze. Instructori specializați și program flexibil.',
  6);

-- ===================== FAQ =====================
INSERT OR REPLACE INTO faqs (id, question, answer, category, sort_order) VALUES
(1, 'Care sunt cerințele pentru a începe cursurile la Start Drive BVL?', 'Pentru a te înscrie la cursurile noastre (Categoria B), trebuie să ai vârsta minimă de 18 ani fără 3 luni (17 ani și 9 luni). Vei avea nevoie de o copie după cartea de identitate, aviz medical și aviz psihologic care atestă că ești apt pentru conducerea autovehiculelor. Echipa noastră te îndrumă pas cu pas în obținerea tuturor documentelor necesare.', 'Înscriere', 1),
(2, 'Cum mă pot înscrie la școala de șoferi Start Drive BVL Suceava?', 'Te poți înscrie în 3 moduri: (1) online prin formularul de pe site, (2) telefonic la 0744 420 905, sau (3) fizic la sediul nostru de pe Strada Mărăști, Nr. 12, Bl. T2 (pe Mărășești, în parcarea MPO). Procesul durează doar câteva minute.', 'Înscriere', 2),
(3, 'Pot începe cursurile imediat după înscriere?', 'Da! Odată ce ai dosarul complet (cazier, avize medicale și psihologice), poți începe orele de teorie chiar din săptămâna înscriere. Te ajutăm noi cu obținerea tuturor documentelor necesare.', 'Înscriere', 3),
(4, 'Cât costă școala de șoferi categoria B în Suceava?', 'Prețul pentru categoria B la Start Drive BVL Suceava este competitiv și include atât pregătirea teoretică (24 ore), cât și cea practică (30 ore). Pentru a afla prețul exact actualizat, te rugăm să ne contactezi la 0744 420 905 sau prin formularul de pe site. Oferim și posibilitatea plății în rate.', 'Costuri', 1),
(5, 'Se pot plăti cursurile în rate?', 'Da, venim în sprijinul cursanților noștri oferind posibilitatea plății în rate egale pe durata școlarizării, fără dobândă și fără gaj. Prima rată se achită în momentul înscrierii și semnării contractului de școlarizare.', 'Costuri', 2),
(6, 'Există costuri ascunse pe lângă prețul cursului?', 'Nu! Prețul comunicat include tot ce ai nevoie: ore de teorie, ore de practică, materiale didactice și suportul administrativ. Singurele costuri suplimentare sunt taxele oficiale: taxa DRPCIV pentru permis (89 lei), avizul medical și cel psihologic.', 'Costuri', 3),
(7, 'Ce acte sunt necesare pentru înscrierea la școala de șoferi?', 'Pentru înscriere ai nevoie de: (1) Copie carte de identitate, (2) Cazier judiciar cu mențiunea „EXAMEN AUTO" (se poate obține online prin Ghișeul.ro), (3) Aviz medical care atestă aptitudinea pentru conducere, (4) Aviz psihologic de la un cabinet autorizat. Te îndrumăm noi către partenerii noștri pentru obținerea avizelor.', 'Acte necesare', 1),
(8, 'De unde obțin cazierul judiciar pentru școala de șoferi?', 'Cazierul judiciar cu mențiunea „EXAMEN AUTO" se poate obține online prin platforma Ghișeul.ro (cel mai rapid), fizic de la sediul IPJ Suceava, sau de la orice agenție CEC Bank. Termenul de eliberare online este de 3-5 zile lucrătoare.', 'Acte necesare', 2),
(9, 'Cum se desfășoară examenul teoretic (sala)?', 'Examenul teoretic se susține la sediul DRPCIV Suceava pe calculator. Primești 26 de întrebări cu variante de răspuns și ai la dispoziție 30 de minute. Trebuie să răspunzi corect la minimum 22 de întrebări (din 26) pentru a promova. Întrebările acoperă legislație rutieră, semnalizare și prim ajutor.', 'Examen teoretic', 1),
(10, 'Câte greșeli am voie la examenul teoretic auto?', 'La examenul teoretic ai dreptul la maximum 4 greșeli din 26 de întrebări. Asta înseamnă că trebuie să răspunzi corect la cel puțin 22 de întrebări. La Start Drive BVL te pregătim temeinic cu simulări de examen pentru a te asigura că ești 100% pregătit.', 'Examen teoretic', 2),
(11, 'Cum să te pregătești pentru examenul teoretic auto?', 'Sfaturile noastre: (1) Participă activ la orele de legislație — nu le sări! (2) Folosește aplicații și teste grila online zilnic, (3) Concentrează-te pe prioritățile de trecere și regulile de circulație, (4) Fă cât mai multe simulări de examen, (5) Întreabă instructorul orice nu e clar. Media de promovabilitate la Start Drive BVL este de 95%.', 'Examen teoretic', 3),
(12, 'Cum se desfășoară examenul practic de conducere (traseu)?', 'Examenul practic durează aproximativ 25-30 de minute și se desfășoară pe traseele oficiale din Suceava. Vei fi evaluat de un polițist examinator pe abilități precum: pornire de pe loc, schimbarea direcției, parcarea, depășirea, circulația prin intersecții și respectarea regulilor de circulație.', 'Examen practic', 1),
(13, 'Ce se întâmplă dacă pic examenul auto de traseu?', 'Dacă nu promovezi traseul, va trebui să efectuezi minim 6 ore suplimentare de condus (3 ședințe) și să te reprogramezi. Vestea bună: examenul teoretic rămâne valid pe toată perioada de 1 an a dosarului. La Start Drive BVL, rata de promovabilitate este de 95%, dar în cazul nepromovării, suntem alături de tine cu ore suplimentare.', 'Examen practic', 2),
(14, 'Care sunt cele mai frecvente greșeli la examenul de traseu?', 'Cele mai frecvente greșeli sunt: (1) Neacordarea de prioritate, (2) Oprirea incorectă la semnul STOP, (3) Nerespectarea semnalizării rutiere, (4) Viteza inadecvată condițiilor, (5) Emoțiile și stresul. Instructorii noștri te pregătesc specific pe aceste puncte pentru a le evita.', 'Examen practic', 3),
(15, 'Cât durează cursul pentru obținerea permisului auto categoria B?', 'Cursul standard pentru categoria B la Start Drive BVL durează cel puțin 4 săptămâni. Acesta cuprinde minim 24 de ore de pregătire teoretică (legislație rutieră) și 30 de ore de pregătire practică (conducere auto) alături de un instructor autorizat. Durata efectivă depinde și de disponibilitatea ta pentru programarea orelor.', 'Categoria B', 1),
(16, 'În cât timp pot obține permisul auto categoria B?', 'Durata medie de la înscriere până la obținerea permisului este de 2-3 luni, în funcție de ritmul tău de pregătire și de programarea examenelor DRPCIV. Cei mai rapizi cursanți ai noștri au obținut permisul în aproximativ 6 săptămâni.', 'Categoria B', 2),
(17, 'Pot face școala pe o mașină cu cutie automată?', 'Da, la Start Drive BVL îți punem la dispoziție și autoturisme echipate cu cutie de viteze automată. Atenție însă: pe permisul auto va fi menționat codul restricției, având dreptul legal să conduci exclusiv mașini automate.', 'Categoria B', 3),
(18, 'Ce permis am nevoie pentru a conduce camionul (TIR)?', 'Pentru a conduce un camion ai nevoie de permisul categoria C, iar pentru ansamblul camion + remorcă (TIR) ai nevoie de categoria CE. Ambele categorii necesită deținerea prealabilă a permisului categoria B și vârsta de 21 de ani (sau 18 ani cu atestat CPI).', 'Categoria C/CE', 1),
(19, 'Oferiți pregătire pentru categoriile C și CE?', 'Da! Start Drive BVL oferă școlarizare completă pentru categoriile C și CE. Avem în flotă camioane moderne MAN TGL și instructori specializați pe gabarit depășit. Pregătirea include exerciții în poligon și trasee externe complexe.', 'Categoria C/CE', 2),
(20, 'Ce este categoria D de permis auto?', 'Categoria D te autorizează să conduci autobuze și autocare cu peste 8 locuri de pasageri. Este permisul necesar pentru șoferi de autobuz urban, interurban și transport turistic. Vârsta minimă este de 24 ani (sau 21 ani cu atestat CPI).', 'Categoria D', 1),
(21, 'Care sunt condițiile pentru obținerea permisului categoria D?', 'Pentru categoria D ai nevoie de: vârsta de 24 ani (sau 21 cu CPI), permis categoria B valid, cazier judiciar fără infracțiuni contra siguranței pe drumuri, aviz medical și psihologic. La Start Drive BVL te pregătim complet pentru examenul DRPCIV.', 'Categoria D', 2),
(22, 'Care este programul de lucru al școlii de șoferi?', 'Sediul nostru de pe Strada Mărăști, Nr. 12, Bl. T2 (pe Mărășești, în parcarea MPO) este deschis de Luni până Vineri între orele 08:00 și 17:00, iar Sâmbătă între orele 10:00 și 14:00 (Duminică este închis). Orele de conducere practică pot fi programate și în afara acestui interval, în funcție de disponibilitatea instructorului, inclusiv în weekend.', 'Program cursuri', 1),
(23, 'Unde are loc pregătirea practică și teoretică?', 'Orele de legislație (pregătirea teoretică) se desfășoară în sala noastră modernă, complet echipată, de pe Strada Mărăști, Nr. 12, Bl. T2, Suceava (pe Mărășești, în parcarea MPO). Traseul practic se efectuează pe traseele oficiale de examen din Suceava și împrejurimi.', 'Program cursuri', 2),
(24, 'Sunt obligatorii orele de conducere pe timp de noapte?', 'Da, conform legislației în vigoare, pe parcursul celor 30 de ore de pregătire practică vei efectua cel puțin o ședință de conducere pe timp de noapte sau în condiții de vizibilitate redusă. Aceasta te pregătește pentru situații reale de trafic.', 'Program cursuri', 3),
(25, 'Cât timp este valabil dosarul după absolvirea școlii?', 'Dosarul de școlarizare are o valabilitate de exact 1 an calendaristic de la data absolvirii. În acest interval ai dreptul să susții examenele auto (teoretic și practic) de câte ori este nevoie, cu condiția efectuării orelor suplimentare obligatorii la fiecare reprogramare.', 'Ședințe suplimentare', 1),
(26, 'Dacă pic examenul auto, trebuie să refac și sala?', 'Nu! Odată ce ai promovat examenul teoretic (sala), acesta rămâne valabil pe toată perioada de 1 an a dosarului. La o eventuală nepromovare a traseului, va trebui doar să efectuezi minim 3 ședințe suplimentare (6 ore) de condus și să te reprogramezi.', 'Ședințe suplimentare', 2),
(27, 'Câte ore suplimentare sunt necesare la reprogramare?', 'La reprogramarea examenului practic sunt necesare minim 6 ore suplimentare de condus (3 ședințe a câte 2 ore). Aceste ședințe se concentrează pe punctele slabe identificate la examenul anterior pentru a maximiza șansele de promovare.', 'Ședințe suplimentare', 3);

-- ===================== INSTRUCTORI =====================
INSERT OR REPLACE INTO instructors (id, name, role, categories, experience, hours, students, tags, image_url, sort_order) VALUES
(1, 'Tofan Florin', 'Instructor Auto & Profesor Legislație', 'B1, B, BE, C, CE, D, DE', '15+ ani', '1300+', '280+', '["Expert toate categoriile", "Profesor legislație", "Program flexibil"]', 'https://i.imgur.com/NAQG3Q3.png', 1),
(2, 'Bivol Sergiu', 'Fondator & Instructor', 'B1, B, BE, C, CE, D, DE', '12+ ani', '1200+', '250+', '["Răbdare infinită", "Metodă personalizată", "Experiență TIR"]', 'https://i.imgur.com/miHAgHu.jpeg', 2),
(3, 'Bejinariu Florin', 'Instructor Auto & Profesor Legislatie', 'B1, B, BE', '10+ ani', '1000+', '300+', '["Expert legislație", "Metode interactive", "Simulări examen"]', 'https://i.imgur.com/N10JK2n.png', 3),
(4, 'Radu Matei', 'Instructor Practic', 'B, B1', '6+ ani', '600+', '150+', '["Tânăr și energic", "Metode moderne", "Program flexibil"]', 'https://i.imgur.com/B2RP6gj.png', 4);

-- ===================== GALERIE =====================
INSERT OR REPLACE INTO gallery_images (id, image_url, album, caption, sort_order, media_type, video_url, layout_size) VALUES
(1, 'https://i.imgur.com/a7H0dcY.jpeg', 'cursanti', 'Cursantă admisă la examen', 1, 'image', NULL, 'normal'),
(2, 'https://i.imgur.com/y7rAASu.jpeg', 'masini', 'Dacia Logan Flotă Auto', 2, 'image', NULL, 'wide'),
(3, 'https://i.imgur.com/TNY8kty.jpeg', 'instructori', 'Pregătire la sală cu instructor', 3, 'image', NULL, 'normal'),
(4, 'https://i.imgur.com/GZrbulS.jpeg', 'evenimente', 'Predare cheie cursant fericit', 4, 'image', NULL, 'tall'),
(5, 'https://i.imgur.com/lL14tcK.jpeg', 'examene', 'Admisă din prima încercare', 5, 'image', NULL, 'normal'),
(6, 'https://i.imgur.com/5FAerI9.jpeg', 'altele', 'Ore practice poligon', 6, 'image', NULL, 'normal'),
(7, 'https://i.imgur.com/ZPt5cxE.jpeg', 'cursanti', 'Zâmbetul de după promovare', 7, 'image', NULL, 'large'),
(8, 'https://i.imgur.com/cJRWu2Y.jpeg', 'cursanti', 'Carnet obținut cu brio', 8, 'image', NULL, 'normal'),
(9, 'https://i.imgur.com/DZ3eM1s.jpeg', 'masini', 'Mașini pregătite de traseu', 9, 'image', NULL, 'normal'),
(10, 'https://i.imgur.com/JePRqEz.jpeg', 'evenimente', 'Video Prezentare Start Drive BVL', 10, 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'wide'),
(11, 'https://i.imgur.com/Gd0aMoy.jpeg', 'cursanti', 'Admis cu 26 puncte la sală', 11, 'image', NULL, 'normal'),
(12, 'https://i.imgur.com/cF9ZWXA.png', 'cursanti', 'Bucurie după proba de traseu', 12, 'image', NULL, 'normal'),
(13, 'https://i.imgur.com/uFXW8u2.jpeg', 'cursanti', 'Absolventă fericită la volan', 13, 'image', NULL, 'normal'),
(14, 'https://i.imgur.com/ApPMueX.png', 'cursanti', 'Vis împlinit pentru cursant', 14, 'image', NULL, 'normal'),
(15, 'https://i.imgur.com/WJlCDWZ.jpeg', 'cursanti', 'Start Drive BVL aduce succesul', 15, 'image', NULL, 'normal');

-- ===================== ARTICOLE BLOG =====================
INSERT OR REPLACE INTO articles (slug, title, excerpt, content, category, tags, image_url, seo_title, seo_description, status, author) VALUES
('cum-sa-te-pregatesti-examen-practic', 'Cum să te pregătești pentru examenul practic de conducere: Sfaturi și Trucuri', 'Obținerea permisului auto poate fi un pas important și emoționant în viața ta. Unul dintre cele mai așteptate momente este examenul practic de conducere.', '## Sfaturi pentru examenul practic

Obținerea permisului auto poate fi un pas important și emoționant în viața ta. Unul dintre cele mai așteptate momente este examenul practic de conducere, în care vei fi evaluat pe abilitățile tale de conducere în situații reale de trafic.

### 1. Cunoaște traseul
Familiarizează-te cu traseele oficiale de examen din Suceava. Instructorii noștri te vor ghida pe fiecare traseu posibil.

### 2. Practică regulat
Nu te baza doar pe orele obligatorii. Dacă simți că ai nevoie, programează ședințe suplimentare.

### 3. Gestionează emoțiile
Respiră profund, concentrează-te pe conducere și nu te grăbi. Examinatorul evaluează siguranța, nu viteza.

### 4. Verifică mașina
Înainte de a porni, ajustează oglinzile, scaunul și centura de siguranță. Demonstrează că ești un șofer responsabil.

### 5. Respectă regulile
Oprește complet la STOP, acordă prioritate corect și semnalizează din timp fiecare manevră.', 'SFATURI', '["examen practic", "permis auto", "sfaturi"]', 'https://i.imgur.com/TNY8kty.jpeg', 'Cum să te pregătești pentru examenul practic — Sfaturi | Start Drive BVL', 'Sfaturi practice pentru a promova examenul de conducere din prima. Trucuri de la instructorii Start Drive BVL Suceava.', 'published', 'admin'),

('cum-sa-te-pregatesti-intrebari-teoretice', 'Cum să te pregătești pentru întrebările teoretice la examenul pentru permisul auto', 'Examenul teoretic este prima probă majoră înainte de a urca la volan alături de examinator. Deși mulți cursanți îl subestimează, necesită un studiu riguros.', '## Pregătirea pentru examenul teoretic

Examenul teoretic este prima probă majoră înainte de a urca la volan. Deși mulți cursanți îl subestimează, necesită un studiu riguros al codului rutier.

### Metodologia de învățare

**1. Participă la toate orele de legislație**
Nu sări nicio oră! Profesorii noștri explică regulile într-un mod practic, cu exemple din traficul real din Suceava.

**2. Folosește aplicații de teste grilă**
Există aplicații gratuite care simulează exact formatul examenului DRPCIV. Fă minimum 5 teste pe zi.

**3. Concentrează-te pe capitolele grele**
Prioritățile de trecere, semnalizarea și regulile intersecțiilor sunt cele mai frecvent testate.

**4. Fă simulări în condiții reale**
Pune un cronometru de 30 de minute și rezolvă 26 de întrebări. Așa te obișnuiești cu presiunea timpului.

**5. Întreabă**
Nu lăsa nicio neclaritate neadresată. Instructorii Start Drive BVL sunt mereu disponibili pentru explicații suplimentare.', 'LEGISLAȚIE', '["examen teoretic", "teste grilă", "legislație"]', 'https://i.imgur.com/SsZQl1w.jpeg', 'Pregătire examen teoretic auto — Metode eficiente | Start Drive BVL', 'Cum să te pregătești eficient pentru examenul teoretic auto. Metodologie de învățare și sfaturi practice de la Start Drive BVL Suceava.', 'published', 'admin'),

('recomandari-alegere-instructor-auto', 'Recomandări pentru alegerea unui instructor auto potrivit', 'Instructorul tău va juca un rol crucial nu doar în obținerea permisului, ci și în formarea ta ca șofer responsabil pe termen lung.', '## Cum alegi instructorul potrivit?

Instructorul tău va juca un rol crucial nu doar în obținerea permisului, ci și în formarea ta ca șofer responsabil pe termen lung.

### Ce să cauți la un instructor

**1. Experiența contează**
Un instructor cu mulți ani de experiență a întâlnit sute de situații și știe exact cum să te pregătească pentru fiecare scenariu posibil.

**2. Răbdarea este esențială**
Învățatul condusului poate fi stresant. Ai nevoie de un instructor care să nu ridice tonul și să înțeleagă ritmul tău.

**3. Comunicarea clară**
Instructorul trebuie să explice fiecare manevră într-un mod pe care să-l înțelegi. Nu toți oamenii învață la fel.

**4. Program flexibil**
Caută un instructor care poate adapta programul la viața ta — mai ales dacă ești la facultate sau la muncă.

### La Start Drive BVL
Echipa noastră de 4 instructori acreditați ISCTR acoperă toate stilurile de predare. La înscriere, îți prezentăm fiecare instructor și te lăsăm pe tine să alegi.', 'SFATURI', '["instructor auto", "alegere", "sfaturi"]', 'https://i.imgur.com/a7H0dcY.jpeg', 'Cum alegi instructorul auto potrivit | Start Drive BVL Suceava', 'Sfaturi pentru alegerea celui mai bun instructor auto. Experiență, răbdare și program flexibil la Start Drive BVL Suceava.', 'published', 'admin'),

('actele-necesare-scoala-soferi', 'Actele necesare pentru școala de șoferi — Ghid complet 2025', 'Descoperă tot ce trebuie să știi despre documentele necesare pentru înscrierea la școala de șoferi. Ghid complet și actualizat.', '## Actele necesare pentru înscriere la școala de șoferi

Pregătirea dosarului pentru școala de șoferi poate părea complicată, dar noi te ghidăm pas cu pas.

### Documente necesare

**1. Copie carte de identitate**
Simplu — o copie după buletin sau carte de identitate validă.

**2. Cazier judiciar**
Cu mențiunea „EXAMEN AUTO". Se obține:
- Online prin Ghișeul.ro (3-5 zile)
- Fizic de la IPJ Suceava
- De la orice agenție CEC Bank

**3. Aviz medical**
Certificat medical de la un cabinet autorizat. Trebuie să ateste că ești apt pentru conducerea autovehiculelor.

**4. Aviz psihologic**
Test psihologic la un cabinet autorizat. Durează aproximativ 30 de minute.

**5. Taxă permis auto (89 Lei)**
Se plătește:
- Online pe Ghișeul.ro
- La orice agenție CEC Bank
- La terminalele SelfPay

### La Start Drive BVL te ajutăm!
Nu știi de unde să începi? Te îndrumăm către partenerii noștri de încredere pentru avize și te ajutăm cu întocmirea completă a dosarului.', 'LEGISLAȚIE', '["acte necesare", "înscriere", "dosar"]', 'https://i.imgur.com/a7H0dcY.jpeg', 'Acte necesare școala de șoferi 2025 — Ghid complet | Start Drive BVL', 'Ghid complet cu actele necesare pentru școala de șoferi în 2025. Cazier, aviz medical, aviz psihologic. Start Drive BVL Suceava.', 'published', 'admin'),

('diferenta-categoria-b-be', 'Diferența dintre categoria B și BE — Ce trebuie să știi', 'Mulți cursanți se întreabă care este diferența exactă dintre categoria B și BE. Află tot ce trebuie să știi despre cele două categorii.', '## Categoria B vs Categoria BE

### Categoria B
Categoria B este cel mai comun tip de permis auto. Îți permite să conduci:
- Autoturisme cu masa totală de maximum 3.500 kg
- Maximum 8+1 locuri
- Ansamblu auto + remorcă ușoară (max 750 kg)

### Categoria BE
Categoria BE extinde drepturile categoriei B:
- Poți tracta remorci/semiremorci cu masa de până la 3.500 kg
- Masa totală a ansamblului poate depăși 4.250 kg
- Ideal pentru rulote mari, platforme auto, remorci bărci

### Când ai nevoie de BE?
- Dacă ai o rulotă grea
- Dacă transporti o barcă mare pe remorcă
- Dacă lucrezi cu platforme auto
- Dacă masa ansamblului depășește 4.250 kg

### La Start Drive BVL
Oferim pregătire completă atât pentru B cât și pentru BE. Contactează-ne pentru detalii!', 'LEGISLAȚIE', '["categoria B", "categoria BE", "diferențe", "remorcă"]', 'https://i.imgur.com/a7H0dcY.jpeg', 'Diferența dintre categoria B și BE — Ghid complet | Start Drive BVL', 'Află diferența dintre permisul categoria B și BE. Când ai nevoie de categoria BE și cum o obții la Start Drive BVL Suceava.', 'published', 'admin');

-- ===================== FLOTĂ MAȘINI =====================
INSERT OR REPLACE INTO cars (id, model, tag, image_url, sort_order) VALUES
(1, 'Dacia Logan', 'Manual', '/images/flota/dacia-logan.jpeg', 1),
(2, 'Dacia Sandero', 'Manual', '/images/flota/dacia-sandero.jpeg', 2),
(3, 'Dacia Logan Stepway', 'Manual', '/images/flota/dacia-logan-stepway.jpeg', 3),
(4, 'MAN TGL (Camion)', 'Manual', '/images/flota/man-tgl.jpeg', 4),
(5, 'Dacia Duster', 'Manual', '/images/flota/dacia-duster.jpeg', 5);

-- ===================== SETĂRI =====================
INSERT OR REPLACE INTO settings (key, value) VALUES
('contact_phone', '0744 420 905'),
('contact_schedule', 'Luni - Vineri: 08:00 - 17:00'),
('inscrieri_cta_title', 'Ești pregătit să începi?'),
('inscrieri_cta_text', 'Înscrie-te astăzi și începe pregătirea pentru permisul tău.'),
('inscrieri_support_text', 'Nu trebuie să te descurci singur. Echipa Start Drive BVL te ajută cu pregătirea dosarului, programarea examenelor medicale și toate informațiile necesare pentru înscriere.');

-- ===================== TESTIMONIALE GENERAL =====================
INSERT OR REPLACE INTO testimonials (id, name, text, rating, source, sort_order) VALUES
(1, 'Alexandru Popa', 'Am avut o experiență excelentă! Instructorii sunt calmi și profesioniști.', 5, 'Google', 1),
(2, 'Maria Ionescu', 'Cea mai bună școală auto din Suceava! Am luat permisul din prima.', 5, 'Google', 2),
(3, 'Cristian D.', 'Profesionalism la superlativ. Recomand cu mare încredere!', 5, 'Google', 3),
(4, 'Elena R.', 'Instructorii sunt răbdători, mașinile noi și curate. Am promovat din prima!', 5, 'Facebook', 4),
(5, 'Andrei M.', 'Plata în rate și program flexibil — exact ce aveam nevoie!', 5, 'Google', 5);

-- ===================== FAQS: PAȘI ÎNSCRIERE =====================
INSERT OR REPLACE INTO faqs (id, question, answer, category, sort_order) VALUES
(28, 'Alegi Categoria și ne Contactezi', 'Ne poți suna sau poți veni direct la sediul nostru pentru a discuta detaliile programului.', 'Pași Înscriere', 1),
(29, 'Întocmirea Dosarului', 'Aduni documentele necesare menționate, iar noi le așezăm în dosarul tău oficial.', 'Pași Înscriere', 2),
(30, 'Orele de Legislație (Teorie)', 'Parcurgi materia în sala noastră modernă, pentru a fi pregătit 100% de traseu.', 'Pași Înscriere', 3),
(31, 'Orele de Condus (Practică)', 'Pornești la drum alături de instructorii noștri. Programul este flexibil.', 'Pași Înscriere', 4);

-- ===================== FAQS: ÎNTREBĂRI SUPLIMENTARE ÎNSCRIERI =====================
INSERT OR REPLACE INTO faqs (id, question, answer, category, sort_order) VALUES
(32, 'Cât durează dosarul?', 'Valabilitatea dosarului de școlarizare este de 1 an calendaristic de la data absolvirii cursurilor (finalizarea orelor practice).', 'Înscriere', 4),
(33, 'Ce acte sunt necesare?', 'Pentru înscriere ai nevoie de cartea de identitate (buletin), cazier judiciar (cu mențiunea examen auto), aviz medical și aviz psihologic.', 'Înscriere', 5),
(34, 'În cât timp încep cursurile?', 'Orele de teorie încep imediat după depunerea primelor documente, de regulă în aceeași săptămână cu înscrierea.', 'Înscriere', 6),
(35, 'Pot face școala dacă sunt elev/student?', 'Da! Avem program ultra-flexibil pentru elevi și studenți, inclusiv ore de condus în weekend sau după terminarea orelor de curs.', 'Înscriere', 7);


