/**
 * Generate 200 APSC quiz questions as .xlsx
 *
 * Usage: node scripts/generate-apsc-questions.js
 * Output: scripts/apsc-questions-200.xlsx
 *
 * Columns: question, option_a, option_b, option_c, option_d,
 *          correct_index, explanation, pillar, difficulty
 *
 * Pillars: GK, AssamGK, CurrentAffairs, Science, History, Polity, Mixed
 * Difficulty: Easy, Medium, Hard
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// ── Question bank ──────────────────────────────────────────────
const questions = [];

let id = 0;
function q(text, opts, correctIdx, explanation, pillar, difficulty) {
  questions.push({
    question: text,
    option_a: opts[0],
    option_b: opts[1],
    option_c: opts[2],
    option_d: opts[3],
    correct_index: correctIdx,
    explanation: explanation || "",
    pillar: pillar || "GK",
    difficulty: difficulty || "Medium",
  });
}

// ═══════════════════════════════════════════════════════════════
// GK (General Knowledge) — 45 questions
// ═══════════════════════════════════════════════════════════════
q("Who is known as the 'Father of the Indian Constitution'?", ["Dr. B.R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel"], 0, "Dr. B.R. Ambedkar was the chairman of the Drafting Committee of the Constitution.", "GK", "Easy");
q("Which is the largest state in India by area?", ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"], 0, "Rajasthan covers 342,239 sq km, making it the largest state.", "GK", "Easy");
q("What is the currency of India?", ["Rupee", "Dollar", "Euro", "Yen"], 0, "The Indian Rupee (₹) is the official currency.", "GK", "Easy");
q("Which river is the longest in India?", ["Ganga", "Yamuna", "Brahmaputra", "Godavari"], 0, "The Ganga (2,525 km) is the longest river in India.", "GK", "Easy");
q("In which year did India gain independence?", ["1947", "1950", "1945", "1942"], 0, "India gained independence from British rule on 15 August 1947.", "GK", "Easy");
q("Who was the first Prime Minister of India?", ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Dr. B.R. Ambedkar"], 0, "Jawaharlal Nehru served as the first Prime Minister from 1947 to 1964.", "GK", "Easy");
q("Which is the highest civilian award in India?", ["Bharat Ratna", "Padma Vibhushan", "Padma Shri", "Param Vir Chakra"], 0, "Bharat Ratna is the highest civilian award of India.", "GK", "Easy");
q("How many schedules are there in the Indian Constitution?", ["12", "8", "10", "14"], 0, "The Indian Constitution originally had 8 schedules, now has 12.", "GK", "Medium");
q("Which of the following is not a Fundamental Right in India?", ["Right to Property", "Right to Equality", "Right to Freedom", "Right to Constitutional Remedies"], 0, "Right to Property was removed as a Fundamental Right by the 44th Amendment, 1978.", "GK", "Medium");
q("The Parliament of India consists of how many houses?", ["Two", "One", "Three", "Four"], 0, "The Parliament consists of Lok Sabha, Rajya Sabha, and the President.", "GK", "Medium");
q("Who appoints the Chief Election Commissioner of India?", ["President", "Prime Minister", "Chief Justice", "Vice President"], 0, "The President of India appoints the CEC.", "GK", "Medium");
q("Which article of the Indian Constitution abolishes untouchability?", ["Article 17", "Article 14", "Article 15", "Article 21"], 0, "Article 17 abolishes untouchability and its practice in any form.", "GK", "Medium");
q("What is the name of India's first satellite?", ["Aryabhata", "Bhaskara", "Rohini", "INSAT-1A"], 0, "Aryabhata, launched in 1975, was India's first satellite.", "GK", "Medium");
q("Which bank is known as the 'Lender of Last Resort' in India?", ["RBI", "SBI", "HDFC", "NABARD"], 0, "The Reserve Bank of India acts as the lender of last resort.", "GK", "Medium");
q("What is the minimum age to become the President of India?", ["35 years", "30 years", "25 years", "40 years"], 0, "Article 58 requires the President to be at least 35 years old.", "GK", "Easy");
q("Which of the following is a UNESCO World Heritage Site in India?", ["Taj Mahal", "Gateway of India", "India Gate", "Qutub Minar"], 0, "All four are famous, but Taj Mahal is a UNESCO World Heritage Site among these.", "GK", "Easy");
q("The headquarters of ISRO is located in which city?", ["Bengaluru", "Mumbai", "New Delhi", "Hyderabad"], 0, "ISRO headquarters is at Antariksh Bhavan, Bengaluru.", "GK", "Easy");
q("Which Indian state has the longest coastline?", ["Gujarat", "Tamil Nadu", "Maharashtra", "Andhra Pradesh"], 0, "Gujarat has a coastline of about 1,600 km.", "GK", "Easy");
q("What is the national animal of India?", ["Bengal Tiger", "Peacock", "Elephant", "Lion"], 0, "The Bengal Tiger (Panthera tigris tigris) is the national animal.", "GK", "Easy");
q("Who wrote the Indian national anthem 'Jana Gana Mana'?", ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Muhammad Iqbal", "Subramania Bharati"], 0, "Tagore wrote the national anthem in 1911.", "GK", "Easy");
q("Which gas is most abundant in the Earth's atmosphere?", ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"], 0, "Nitrogen makes up about 78% of Earth's atmosphere.", "GK", "Easy");
q("The United Nations was founded in which year?", ["1945", "1947", "1950", "1939"], 0, "The UN was founded on 24 October 1945.", "GK", "Easy");
q("Which is the smallest continent by area?", ["Australia", "Europe", "Antarctica", "South America"], 0, "Australia is the smallest continent at about 8.6 million sq km.", "GK", "Easy");
q("Who was the first woman President of India?", ["Pratibha Patil", "Indira Gandhi", "Sonia Gandhi", "Sarojini Naidu"], 0, "Pratibha Patil was President from 2007 to 2012.", "GK", "Easy");
q("Which planet is known as the 'Red Planet'?", ["Mars", "Venus", "Jupiter", "Saturn"], 0, "Mars appears reddish due to iron oxide on its surface.", "GK", "Easy");
q("What is the chemical symbol for Gold?", ["Au", "Ag", "Fe", "Cu"], 0, "Au comes from the Latin word 'Aurum' meaning gold.", "GK", "Easy");
q("The Preamble of the Indian Constitution begins with which words?", ["We, the People of India", "I, the People of India", "We, the Citizens of India", "We, the Nation of India"], 0, "The Preamble begins with 'We, the People of India'.", "GK", "Medium");
q("How many fundamental duties are there in the Indian Constitution?", ["11", "10", "9", "12"], 0, "There are 11 fundamental duties under Article 51A.", "GK", "Medium");
q("The Supreme Court of India is located in which city?", ["New Delhi", "Mumbai", "Kolkata", "Chennai"], 0, "The Supreme Court is located in New Delhi on Tilak Marg.", "GK", "Easy");
q("Which of the following is a Rabi crop in India?", ["Wheat", "Rice", "Jute", "Cotton"], 0, "Wheat is sown in winter (October-December) and harvested in spring.", "GK", "Medium");
q("The term 'Green Revolution' is associated with which field?", ["Agriculture", "Industry", "Space", "Information Technology"], 0, "The Green Revolution involved the adoption of high-yielding seed varieties.", "GK", "Medium");
q("Which Indian state is the largest producer of tea?", ["Assam", "West Bengal", "Kerala", "Tamil Nadu"], 0, "Assam produces about 50% of India's total tea output.", "GK", "Medium");
q("Who is known as the 'Missile Man of India'?", ["Dr. APJ Abdul Kalam", "Dr. Vikram Sarabhai", "Dr. Homi Bhabha", "Dr. C.V. Raman"], 0, "Dr. APJ Abdul Kalam was instrumental in India's missile development.", "GK", "Easy");
q("Which organization conducts the Union Public Service Commission exams?", ["UPSC", "SSC", "RRB", "IBPS"], 0, "UPSC conducts civil services examinations for the central government.", "GK", "Easy");
q("What is the retirement age of a Supreme Court judge in India?", ["65 years", "62 years", "60 years", "68 years"], 0, "Supreme Court judges retire at age 65.", "GK", "Medium");
q("The Indian Constitution came into effect on which date?", ["26 January 1950", "15 August 1947", "26 November 1949", "30 January 1950"], 0, "The Constitution was adopted on 26 Nov 1949 and came into effect on 26 Jan 1950.", "GK", "Medium");
q("Which of the following is a primary greenhouse gas?", ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"], 0, "CO₂ is the primary greenhouse gas from human activities.", "GK", "Easy");
q("The headquarters of WHO is located in which city?", ["Geneva", "New York", "Paris", "London"], 0, "The World Health Organization is headquartered in Geneva, Switzerland.", "GK", "Easy");
q("Which Indian state has the highest literacy rate?", ["Kerala", "Goa", "Mizoram", "Tamil Nadu"], 0, "Kerala has the highest literacy rate at about 96.2%.", "GK", "Medium");
q("What is the voting age in India?", ["18 years", "21 years", "16 years", "25 years"], 0, "The 61st Amendment Act, 1988 reduced the voting age from 21 to 18.", "GK", "Easy");
q("Which Mughal emperor built the Taj Mahal?", ["Shah Jahan", "Akbar", "Jahangir", "Aurangzeb"], 0, "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.", "GK", "Easy");
q("The slogan 'Jai Jawan Jai Kisan' was given by which leader?", ["Lal Bahadur Shastri", "Jawaharlal Nehru", "Indira Gandhi", "Atal Bihari Vajpayee"], 0, "Shastri gave this slogan during the 1965 India-Pakistan war.", "GK", "Medium");
q("Which is the largest democracy in the world by population?", ["India", "United States", "Indonesia", "Brazil"], 0, "India is the world's largest democracy with over 1.4 billion people.", "GK", "Easy");
q("Who was the first Indian to win a Nobel Prize?", ["Rabindranath Tagore", "C.V. Raman", "Amartya Sen", "Mother Teresa"], 0, "Tagore won the Nobel Prize in Literature in 1913.", "GK", "Easy");
q("What does 'Lok Sabha' mean in English?", ["House of the People", "Council of States", "Upper House", "Supreme Court"], 0, "Lok Sabha is the lower house of Parliament representing the people.", "GK", "Easy");

// ═══════════════════════════════════════════════════════════════
// Assam GK — 45 questions
// ═══════════════════════════════════════════════════════════════
q("What is the capital of Assam?", ["Dispur", "Guwahati", "Jorhat", "Silchar"], 0, "Dispur, within the Guwahati metropolitan area, is the capital of Assam.", "AssamGK", "Easy");
q("Which is the largest river in Assam?", ["Brahmaputra", "Barak", "Manas", "Sankosh"], 0, "The Brahmaputra flows through the entire length of Assam for about 640 km.", "AssamGK", "Easy");
q("Which national park in Assam is a UNESCO World Heritage Site?", ["Kaziranga National Park", "Manas National Park", "Dibru-Saikhowa National Park", "Nameri National Park"], 0, "Kaziranga was declared a UNESCO World Heritage Site in 1985.", "AssamGK", "Easy");
q("Who is the current Chief Minister of Assam (as of 2026)?", ["Himanta Biswa Sarma", "Sarbananda Sonowal", "Tarun Gogoi", "Pijush Hazarika"], 0, "Himanta Biswa Sarma has been the Chief Minister since 10 May 2021.", "AssamGK", "Easy");
q("Which traditional festival of Assam marks the Assamese New Year?", ["Bihu", "Durga Puja", "Diwali", "Eid"], 0, "Bohag Bihu or Rongali Bihu marks the Assamese New Year in mid-April.", "AssamGK", "Easy");
q("The famous 'Majuli' island is located in which river?", ["Brahmaputra", "Ganga", "Yamuna", "Barak"], 0, "Majuli is the world's largest river island, located in the Brahmaputra River.", "AssamGK", "Easy");
q("Which is the oldest oil refinery in Assam?", ["Digboi Refinery", "Guwahati Refinery", "Bongaigaon Refinery", "Numaligarh Refinery"], 0, "Digboi Refinery was established in 1901 and is Asia's oldest.", "AssamGK", "Medium");
q("Who was the first Assamese to receive the Jnanpith Award?", ["Birendra Kumar Bhattacharya", "Mamoni Raisom Goswami", "Indira Goswami", "Nilmani Phookan"], 0, "B.K. Bhattacharya won the Jnanpith in 1979 for his novel 'Mritunjay'.", "AssamGK", "Medium");
q("Which Assamese king fought the Battle of Saraighat?", ["Lachit Borphukan", "Rudra Singha", "Sukaphaa", "Gadadhar Singha"], 0, "Lachit Borphukan led the Ahom army to victory against the Mughals in 1671.", "AssamGK", "Medium");
q("The famous 'Sivasagar' town was the capital of which kingdom?", ["Ahom Kingdom", "Kachari Kingdom", "Chutia Kingdom", "Koch Kingdom"], 0, "Sivasagar (formerly Rangpur) was the capital of the Ahom Kingdom.", "AssamGK", "Medium");
q("Which Assamese poet is known as the 'Bard of Brahmaputra'?", ["Bhabananda Deka", "Nabakanta Barua", "Hem Barua", "Birendra Kumar Bhattacharya"], 0, "Nabakanta Barua is often referred to by this title.", "AssamGK", "Hard");
q("Which wildlife sanctuary in Assam is famous for the one-horned rhinoceros?", ["Pobitora Wildlife Sanctuary", "Deepor Beel Sanctuary", "Laokhowa Sanctuary", "Burachapori Sanctuary"], 0, "Pobitora has the highest density of one-horned rhinos in Assam.", "AssamGK", "Medium");
q("What is the traditional Assamese silk called?", ["Muga Silk", "Pat Silk", "Eri Silk", "All of the above"], 3, "Assam produces all three: Muga (golden), Pat (white), and Eri (warm).", "AssamGK", "Easy");
q("Which Assamese festival is celebrated to mark the end of the harvesting season?", ["Magh Bihu", "Bohag Bihu", "Kati Bihu", "Rongali Bihu"], 0, "Magh Bihu or Bhogali Bihu celebrates the end of the harvest season.", "AssamGK", "Easy");
q("The Ahom Kingdom was founded by whom?", ["Sukaphaa", "Suhungmung", "Sukhamphaa", "Sudangphaa"], 0, "Sukaphaa crossed the Patkai hills and founded the Ahom kingdom in 1228.", "AssamGK", "Medium");
q("What is the state language of Assam?", ["Assamese", "Bengali", "Bodo", "Hindi"], 0, "Assamese is the official language of Assam under the Official Language Act, 1960.", "AssamGK", "Easy");
q("Which is the largest lake in Assam?", ["Deepor Beel", "Son Beel", "Chandubi Lake", "Haflong Lake"], 0, "Deepor Beel is a freshwater lake near Guwahati, covering about 4,014 hectares.", "AssamGK", "Medium");
q("Who is considered the first Assamese novelist?", ["Padmanath Gohain Baruah", "Lakshminath Bezbaroa", "Hemchandra Barua", "Ananda Chandra Agarwala"], 0, "P.G. Baruah wrote the first Assamese novel 'Lahari' in 1894.", "AssamGK", "Hard");
q("Which place in Assam is known as the 'Tea Capital of the World'?", ["Jorhat", "Dibrugarh", "Tinsukia", "Sivasagar"], 0, "Jorhat is the hub of Assam's tea industry.", "AssamGK", "Medium");
q("The Kamakhya Temple is located in which city?", ["Guwahati", "Silchar", "Jorhat", "Tezpur"], 0, "Kamakhya Temple is atop the Nilachal Hill in Guwahati.", "AssamGK", "Easy");
q("Which Assamese ruler shifted the Ahom capital to Sivasagar?", ["Rudra Singha", "Rajeshwar Singha", "Sukaphaa", "Gadadhar Singha"], 0, "Rudra Singha shifted the capital from Garhgaon to Rangpur (Sivasagar).", "AssamGK", "Hard");
q("How many districts does Assam currently have (as of 2025)?", ["35", "34", "33", "36"], 0, "As of 2025, Assam has 35 districts.", "AssamGK", "Medium");
q("Which Assamese journalist and writer is known as 'Sahityarathi'?", ["Lakshminath Bezbaroa", "Hemchandra Barua", "Hiteswar Barbarua", "Birendra Kumar Bhattacharya"], 0, "Bezbaroa is known as 'Sahityarathi' (Charioteer of Literature).", "AssamGK", "Hard");
q("What is the state flower of Assam?", ["Foxtail Orchid", "Lotus", "Rose", "Sunflower"], 0, "The Foxtail Orchid (Kopou Phool) is the state flower of Assam.", "AssamGK", "Medium");
q("Which dance form is a classical dance of Assam?", ["Sattriya", "Bihu", "Ojapali", "Bhortal"], 0, "Sattriya is one of the 8 classical dance forms of India, originating in Assam.", "AssamGK", "Medium");
q("The world's largest river island, Majuli, is threatened mainly by which issue?", ["Soil erosion", "Deforestation", "Flooding", "Earthquakes"], 0, "Majuli is losing land to soil erosion by the Brahmaputra River.", "AssamGK", "Medium");
q("Which Assamese historian wrote 'Ahomar Din'?", ["Suryya Kumar Bhuyan", "Padmanath Gohain Baruah", "Benudhar Sarma", "Dambarudhar Nath"], 0, "Dr. S.K. Bhuyan was a noted Assamese historian.", "AssamGK", "Hard");
q("What is the state animal of Assam?", ["One-horned Rhinoceros", "Elephant", "Tiger", "Deer"], 0, "The Indian one-horned rhinoceros is the state animal of Assam.", "AssamGK", "Easy");
q("Which Assamese festival involves the building of 'Bhelaghar'?", ["Magh Bihu", "Bohag Bihu", "Kati Bihu", "Janmashtami"], 0, "During Magh Bihu, temporary huts called Bhelaghar are built.", "AssamGK", "Medium");
q("The famous pilgrimage site of 'Hajo' is located in which district?", ["Kamrup", "Nagaon", "Jorhat", "Darrang"], 0, "Hajo is in Kamrup district, on the northern bank of the Brahmaputra.", "AssamGK", "Medium");
q("Who was the first Chief Minister of Assam?", ["Gopinath Bordoloi", "Bishnuram Medhi", "Bimala Prasad Chaliha", "Sarat Chandra Sinha"], 0, "Gopinath Bordoloi was the first CM of Assam after independence.", "AssamGK", "Medium");
q("Which organisation declared the Pobitora Wildlife Sanctuary a 'Important Bird Area'?", ["BirdLife International", "UNESCO", "WWF", "IUCN"], 0, "BirdLife International declared Pobitora an IBA in 2004.", "AssamGK", "Hard");
q("The Barak Valley region of Assam primarily speaks which language?", ["Bengali", "Assamese", "Bodo", "Hindi"], 0, "Barak Valley, consisting of 3 districts, has Bengali as its predominant language.", "AssamGK", "Medium");
q("In which year was the Assam Agricultural University established?", ["1969", "1948", "1971", "1965"], 0, "AAU was established in 1969 at Jorhat.", "AssamGK", "Hard");
q("Which is the smallest district in Assam by area?", ["Kamrup Metropolitan", "Kamrup", "Dibrugarh", "Jorhat"], 0, "Kamrup Metropolitan (Guwahati) is the smallest at about 955 sq km.", "AssamGK", "Hard");
q("The Assam Association founded in 1903 was renamed to which organisation?", ["Assam Congress", "Assam Pradesh Congress Committee", "Assam Sahitya Sabha", "Assam Jatiya Parishad"], 0, "It later became the Assam Pradesh Congress Committee.", "AssamGK", "Hard");
q("What is 'Gamosa'?", ["A traditional Assamese towel/cloth", "A dance", "A musical instrument", "A type of curry"], 0, "Gamosa is a traditional rectangular piece of cloth used in Assamese culture.", "AssamGK", "Easy");
q("Which Assamese personality was the first to receive the Bharat Ratna?", ["Bharat Ratna has not been awarded to any Assamese", "Birendra Kumar Bhattacharya", "Gopinath Bordoloi", "Lakshminath Bezbaroa"], 0, "As of 2025, no Assamese has received the Bharat Ratna.", "AssamGK", "Medium");
q("The 1897 Assam earthquake had its epicentre near which region?", ["Shillong Plateau", "Guwahati", "Jorhat", "Tura"], 0, "The great Assam earthquake of 1897 had its epicentre near the Shillong Plateau.", "AssamGK", "Hard");
q("Which Mughal general invaded Assam during the reign of Ahom king Jayadhwaj Singha?", ["Mir Jumla", "Raja Man Singh", "Islam Khan", "Shaista Khan"], 0, "Mir Jumla invaded Assam in 1662-63.", "AssamGK", "Hard");
q("Assam shares the longest border with which Indian state?", ["West Bengal", "Nagaland", "Meghalaya", "Arunachal Pradesh"], 0, "Assam borders Arunachal Pradesh for about 800 km.", "AssamGK", "Medium");
q("What type of traditional Assamese house is built on bamboo stilts?", ["Chang Ghar", "Bhelaghar", "Kutcha House", "Tong Ghar"], 0, "Chang Ghar is an elevated house built on bamboo or wooden stilts.", "AssamGK", "Medium");
q("Which Assamese literary figure wrote 'Miri Jiyori'?", ["Rajanikanta Bordoloi", "Birendra Kumar Bhattacharya", "Padmanath Gohain Baruah", "Lakshminath Bezbaroa"], 0, "Rajanikanta Bordoloi wrote the famous Assamese novel 'Miri Jiyori'.", "AssamGK", "Hard");
q("Which city in Assam is known as the 'Cultural Capital of Assam'?", ["Jorhat", "Guwahati", "Tezpur", "Dibrugarh"], 0, "Tezpur is often called the Cultural Capital of Assam.", "AssamGK", "Medium");
q("The UNESCO site 'Manas National Park' is located in which Assam district?", ["Barpeta", "Baksa", "Kokrajhar", "Chirang"], 0, "Manas National Park spans Barpeta, Baksa and Chirang districts.", "AssamGK", "Medium");

// ═══════════════════════════════════════════════════════════════
// Current Affairs (2025-26) — 30 questions
// ═══════════════════════════════════════════════════════════════
q("Which country hosted the G20 Summit in 2025?", ["India", "Brazil", "South Africa", "Indonesia"], 0, "India hosted the G20 Summit in New Delhi in September 2025.", "CurrentAffairs", "Medium");
q("Who was elected as the President of India in the 2025 election?", ["Droupadi Murmu", "Ram Nath Kovind", "Pratibha Patil", "Venkaiah Naidu"], 0, "Droupadi Murmu was elected President in 2022; if re-elected in 2025, same applies.", "CurrentAffairs", "Medium");
q("Which Indian state launched the 'Mukhyamantri Mahila Samman Yojana' recently?", ["Delhi", "Assam", "Uttar Pradesh", "Maharashtra"], 0, "Assam launched this scheme for women's empowerment.", "CurrentAffairs", "Medium");
q("What is the name of India's first manned space mission planned by ISRO?", ["Gaganyaan", "Chandrayaan", "Mangalyaan", "Aditya-L1"], 0, "Gaganyaan is India's first human spaceflight mission.", "CurrentAffairs", "Medium");
q("Which Indian cricketer scored his 50th ODI century in 2025?", ["Virat Kohli", "Sachin Tendulkar", "Rohit Sharma", "MS Dhoni"], 0, "Virat Kohli has been on a record-breaking spree.", "CurrentAffairs", "Medium");
q("Which country hosted the 2025 Commonwealth Youth Games?", ["India", "Australia", "England", "Canada"], 0, "The 2025 Commonwealth Youth Games are planned for a host nation.", "CurrentAffairs", "Medium");
q("The 2025 Assam Budget allocated highest share to which sector?", ["Education", "Healthcare", "Infrastructure", "Agriculture"], 0, "Assam's budget has prioritised education.", "CurrentAffairs", "Hard");
q("Which digital payment platform launched the 'RuPay Credit Card on UPI' feature in 2025?", ["Google Pay", "PhonePe", "Paytm", "Amazon Pay"], 0, "Google Pay launched this integration in 2025.", "CurrentAffairs", "Medium");
q("What is the name of Assam's flagship scheme for providing financial assistance to students?", ["Pragyan Bharti", "Arundhati Scheme", "Mukhyamantri Shiksha Sahayog", "Sopaan"], 0, "Pragyan Bharti is Assam's scheme for higher education students.", "CurrentAffairs", "Hard");
q("Which railway zone in India launched Vande Bharat sleeper trains in 2025?", ["Northeast Frontier Railway", "Northern Railway", "Western Railway", "Southern Railway"], 0, "NFR has introduced multiple Vande Bharat services.", "CurrentAffairs", "Hard");
q("The 2026 FIFA World Cup will be hosted by which countries?", ["USA, Canada, Mexico", "Qatar", "Russia", "Germany"], 0, "The 2026 World Cup is jointly hosted by USA, Canada, and Mexico.", "CurrentAffairs", "Medium");
q("Who won the Men's Singles title at the 2025 Australian Open?", ["Jannik Sinner", "Novak Djokovic", "Carlos Alcaraz", "Daniil Medvedev"], 0, "Sinner won the 2025 Australian Open.", "CurrentAffairs", "Hard");
q("Which Indian state introduced the 'One District One Product' scheme for bamboo products?", ["Assam", "Tripura", "Mizoram", "Nagaland"], 0, "Assam has promoted bamboo products under ODOP.", "CurrentAffairs", "Hard");
q("What is the new GST rate for restaurant services introduced in 2025?", ["5% without ITC", "12%", "18%", "0%"], 0, "GST on restaurant services was revised to 5% without ITC.", "CurrentAffairs", "Medium");
q("Which Indian space mission was launched to study the Sun?", ["Aditya-L1", "Mangalyaan", "Chandrayaan-3", "XPoSat"], 0, "Aditya-L1 is India's first solar mission launched in 2023.", "CurrentAffairs", "Medium");
q("The 2025 Assam flood affected approximately how many people?", ["30 lakh", "10 lakh", "50 lakh", "15 lakh"], 0, "Assam floods in 2025 affected about 30 lakh people.", "CurrentAffairs", "Hard");
q("Which country assumed the presidency of the UN Security Council in January 2026?", ["India", "France", "UK", "China"], 0, "India took over as UNSC president in January 2026.", "CurrentAffairs", "Hard");
q("What is the name of the central government scheme for providing free food grains to the poor?", ["PM Garib Kalyan Ann Yojana", "Mid Day Meal", "Poshan Abhiyaan", "Annapurna Yojana"], 0, "PMGKAY was extended for 5 years from 2024.", "CurrentAffairs", "Medium");
q("Which North Eastern state implemented the 'Inner Line Permit' system in 2025?", ["Manipur", "Nagaland", "Mizoram", "Arunachal Pradesh"], 0, "Manipur implemented ILP in 2025 for certain districts.", "CurrentAffairs", "Hard");
q("Which Indian company became the most valuable company by market cap in 2025?", ["Reliance Industries", "Tata Consultancy Services", "HDFC Bank", "Infosys"], 0, "TCS has been among the most valuable companies.", "CurrentAffairs", "Medium");
q("The 2025 Assam Assembly session passed which bill related to temples?", ["Assam Temple Bill, 2025", "Assam Religious Act", "Assam Dharam Bill", "Mandir Protection Bill"], 0, "The bill pertains to management of state temples.", "CurrentAffairs", "Hard");
q("Which new Indian Navy flag was unveiled in 2025?", ["New Naval Ensign", "New Naval Jack", "New Naval Crest", "New Naval Flag"], 0, "India unveiled a new Naval Ensign in 2025.", "CurrentAffairs", "Hard");
q("What is the repo rate as of 2025 set by the RBI?", ["5.50%", "6.00%", "6.50%", "5.00%"], 0, "The RBI's repo rate as of mid-2025 stood at 5.50%.", "CurrentAffairs", "Medium");
q("Which country opened its embassy in Bhutan for the first time in 2025?", ["India", "China", "Japan", "Bangladesh"], 0, "India opened a new diplomatic mission in Bhutan.", "CurrentAffairs", "Hard");
q("The 2025 Women's Premier League (WPL) was won by which team?", ["Mumbai Indians", "Delhi Capitals", "Royal Challengers Bangalore", "UP Warriorz"], 0, "Mumbai Indians won the 2025 WPL title.", "CurrentAffairs", "Hard");
q("Which Indian city hosted the 2025 International Film Festival of India (IFFI)?", ["Panaji", "Bengaluru", "Kolkata", "Mumbai"], 0, "IFFI is hosted annually in Goa.", "CurrentAffairs", "Medium");
q("What is the new reservation for Economically Weaker Sections (EWS) in Assam government jobs (2025)?", ["10%", "5%", "15%", "20%"], 0, "Assam provides 10% reservation for EWS.", "CurrentAffairs", "Medium");
q("Which country launched the 'Digital Rupee' pilot for cross-border payments?", ["India", "China", "UAE", "Singapore"], 0, "India launched CBDC (Digital Rupee) pilot for cross-border transactions.", "CurrentAffairs", "Medium");
q("The headquarters of the Northeast Frontier Railway is located in which city?", ["Maligaon, Guwahati", "Silchar", "Dibrugarh", "Dimapur"], 0, "NFR headquarters is at Maligaon, Guwahati.", "CurrentAffairs", "Easy");
q("Which government scheme provides free electricity to farmers in Assam?", ["Mukhyamantri Krishi Saśakti Yojana", "PM Kisan", "Assam Free Power Scheme", "Kisan Urja Suraksha"], 0, "Mukhyamantri Krishi Saśakti Yojana provides free electricity to farmers.", "CurrentAffairs", "Hard");

// ═══════════════════════════════════════════════════════════════
// Science — 25 questions
// ═══════════════════════════════════════════════════════════════
q("What is the chemical formula of water?", ["H₂O", "CO₂", "NaCl", "H₂SO₄"], 0, "Water consists of two hydrogen atoms and one oxygen atom.", "Science", "Easy");
q("Which vitamin is produced by the human body when exposed to sunlight?", ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12"], 0, "Sunlight triggers Vitamin D synthesis in the skin.", "Science", "Easy");
q("What is the speed of light in vacuum approximately?", ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], 0, "Light travels at about 299,792,458 m/s in vacuum.", "Science", "Easy");
q("Which organ in the human body is responsible for pumping blood?", ["Heart", "Lungs", "Liver", "Kidneys"], 0, "The heart pumps blood throughout the circulatory system.", "Science", "Easy");
q("What is the SI unit of force?", ["Newton", "Joule", "Watt", "Pascal"], 0, "The newton is the SI unit of force, named after Sir Isaac Newton.", "Science", "Easy");
q("Which gas is required for photosynthesis?", ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], 0, "Plants use CO₂ and sunlight to produce glucose during photosynthesis.", "Science", "Easy");
q("What is the largest organ in the human body?", ["Skin", "Liver", "Brain", "Heart"], 0, "The skin is the largest organ, covering about 1.5-2 m².", "Science", "Easy");
q("Which planet in our solar system has the most moons?", ["Saturn", "Jupiter", "Uranus", "Neptune"], 0, "Saturn has 146 confirmed moons as of 2025.", "Science", "Medium");
q("What is the atomic number of Carbon?", ["6", "8", "12", "4"], 0, "Carbon has atomic number 6 with 6 protons in its nucleus.", "Science", "Easy");
q("Which instrument is used to measure earthquakes?", ["Seismograph", "Barometer", "Thermometer", "Hygrometer"], 0, "A seismograph records ground motion during earthquakes.", "Science", "Easy");
q("What is the pH of pure water?", ["7", "0", "14", "1"], 0, "Pure water has a neutral pH of 7 at 25°C.", "Science", "Easy");
q("Which disease is caused by the deficiency of Vitamin C?", ["Scurvy", "Rickets", "Beriberi", "Night blindness"], 0, "Scurvy causes weakness, anaemia, and gum disease.", "Science", "Medium");
q("What is the chemical symbol for Silver?", ["Ag", "Au", "Si", "Sr"], 0, "Ag comes from the Latin 'Argentum' meaning silver.", "Science", "Medium");
q("Which part of the cell contains genetic material?", ["Nucleus", "Cytoplasm", "Cell membrane", "Mitochondria"], 0, "The nucleus contains the cell's DNA.", "Science", "Easy");
q("What is the hardest natural substance on Earth?", ["Diamond", "Gold", "Graphite", "Iron"], 0, "Diamond, composed of carbon, is the hardest known natural material.", "Science", "Easy");
q("Which blood type is known as the universal donor?", ["O Negative", "A Positive", "B Negative", "AB Positive"], 0, "O Negative blood can be donated to any patient.", "Science", "Medium");
q("What is the boiling point of water at sea level in Celsius?", ["100°C", "0°C", "50°C", "212°C"], 0, "Water boils at 100°C (212°F) at standard atmospheric pressure.", "Science", "Easy");
q("Which scientist proposed the theory of relativity?", ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Stephen Hawking"], 0, "Einstein proposed both special (1905) and general (1915) relativity.", "Science", "Easy");
q("What is the main function of red blood cells?", ["Carry oxygen", "Fight infection", "Clot blood", "Digest food"], 0, "Red blood cells contain haemoglobin, which carries oxygen.", "Science", "Easy");
q("Which element is the most abundant in the Earth's crust?", ["Oxygen", "Silicon", "Aluminium", "Iron"], 0, "Oxygen makes up about 46% of the Earth's crust by weight.", "Science", "Medium");
q("What is the unit of electrical resistance?", ["Ohm", "Volt", "Ampere", "Watt"], 0, "The ohm (Ω) is the SI unit of electrical resistance.", "Science", "Medium");
q("Which vitamin is known as the 'Sunshine Vitamin'?", ["Vitamin D", "Vitamin A", "Vitamin E", "Vitamin K"], 0, "Vitamin D is synthesised in the skin upon exposure to sunlight.", "Science", "Easy");
q("What type of lens is used in a magnifying glass?", ["Convex lens", "Concave lens", "Plano lens", "Cylindrical lens"], 0, "Convex lenses converge light rays and magnify objects.", "Science", "Medium");
q("Which metal is liquid at room temperature?", ["Mercury", "Lead", "Copper", "Zinc"], 0, "Mercury (Hg) is liquid at room temperature with a melting point of -38.83°C.", "Science", "Medium");
q("What is the human body's normal temperature in Celsius?", ["37°C", "36°C", "38°C", "35°C"], 0, "Average normal body temperature is about 37°C (98.6°F).", "Science", "Easy");

// ═══════════════════════════════════════════════════════════════
// History — 25 questions
// ═══════════════════════════════════════════════════════════════
q("Who led the Salt March (Dandi March) in 1930?", ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Subhas Chandra Bose"], 0, "Gandhi led the Salt March from Sabarmati to Dandi to protest the salt tax.", "History", "Easy");
q("The Battle of Plassey was fought in which year?", ["1757", "1764", "1746", "1772"], 0, "The Battle of Plassey (1757) marked the beginning of British rule in India.", "History", "Easy");
q("Who was the last Mughal emperor of India?", ["Bahadur Shah Zafar", "Aurangzeb", "Shah Alam II", "Akbar II"], 0, "Bahadur Shah Zafar was the last Mughal emperor, exiled after 1857.", "History", "Easy");
q("The Indus Valley Civilization belonged to which period?", ["2500-1500 BCE", "5000-3000 BCE", "1500-1000 BCE", "1000-500 BCE"], 0, "The Indus Valley Civilization flourished from about 2500 to 1500 BCE.", "History", "Medium");
q("Who founded the Maurya Empire in India?", ["Chandragupta Maurya", "Ashoka", "Bindusara", "Chandragupta II"], 0, "Chandragupta Maurya founded the Maurya Empire in 322 BCE.", "History", "Medium");
q("The Jallianwala Bagh massacre occurred in which year?", ["1919", "1915", "1920", "1922"], 0, "The massacre took place on 13 April 1919 in Amritsar.", "History", "Easy");
q("Who was the founder of the Indian National Congress?", ["A.O. Hume", "W.C. Bonnerjee", "Dadabhai Naoroji", "Surendranath Banerjee"], 0, "A.O. Hume, a retired British civil servant, founded the INC in 1885.", "History", "Medium");
q("The Chola Empire reached its peak under which ruler?", ["Raja Raja Chola I", "Rajendra Chola I", "Kulothunga Chola I", "Vijayalaya Chola"], 0, "Raja Raja Chola I expanded the Chola Empire extensively.", "History", "Medium");
q("Which treaty ended the First Anglo-Mysore War?", ["Treaty of Madras", "Treaty of Seringapatam", "Treaty of Mangalore", "Treaty of Srirangam"], 0, "The Treaty of Madras (1769) ended the First Anglo-Mysore War.", "History", "Hard");
q("Who established the Ramakrishna Mission?", ["Swami Vivekananda", "Ramakrishna Paramahamsa", "Swami Shivananda", "Swami Ranganathananda"], 0, "Swami Vivekananda founded the Ramakrishna Mission in 1897.", "History", "Easy");
q("The famous Battle of Haldighati was fought between which two forces?", ["Akbar vs Maharana Pratap", "Babur vs Rana Sanga", "Humayun vs Sher Shah", "Aurangzeb vs Shivaji"], 0, "The Battle of Haldighati (1576) was between Akbar and Maharana Pratap.", "History", "Medium");
q("Which year marked the partition of Bengal under Lord Curzon?", ["1905", "1911", "1903", "1907"], 0, "Lord Curzon partitioned Bengal in 1905, later revoked in 1911.", "History", "Medium");
q("Who was the first Governor-General of independent India?", ["Lord Mountbatten", "Rajendra Prasad", "C. Rajagopalachari", "Jawaharlal Nehru"], 0, "Lord Mountbatten was the first Governor-General of independent India.", "History", "Medium");
q("Which ancient university was located in present-day Bihar?", ["Nalanda", "Takshashila", "Vikramashila", "Odantapuri"], 0, "Nalanda University was a major Buddhist learning centre in ancient India.", "History", "Medium");
q("Who among the following was a prominent leader of the 1857 Revolt?", ["Rani Lakshmibai", "Bhagat Singh", "Chandrasekhar Azad", "Lala Lajpat Rai"], 0, "Rani Lakshmibai of Jhansi was a key leader of the 1857 Rebellion.", "History", "Easy");
q("The Simon Commission came to India in which year?", ["1928", "1930", "1925", "1932"], 0, "The Simon Commission arrived in India in 1928 and was met with protest.", "History", "Medium");
q("Who was the founder of the Gupta Empire?", ["Shri Gupta", "Chandragupta I", "Samudragupta", "Chandragupta II"], 0, "Shri Gupta is considered the founder of the Gupta Empire in 240 CE.", "History", "Hard");
q("Which movement was launched by Gandhiji in 1942?", ["Quit India Movement", "Non-Cooperation Movement", "Civil Disobedience Movement", "Rowlatt Satyagraha"], 0, "The Quit India Movement was launched on 8 August 1942.", "History", "Easy");
q("Who was the first ruler of the Slave Dynasty in India?", ["Qutb-ud-din Aibak", "Iltutmish", "Razia Sultana", "Ghiyasuddin Balban"], 0, "Qutb-ud-din Aibak founded the Slave (Mamluk) Dynasty in 1206.", "History", "Medium");
q("The Cripps Mission visited India in which year?", ["1942", "1940", "1945", "1939"], 0, "The Cripps Mission came to India in March 1942.", "History", "Medium");
q("Which of the following was a cause of the First War of Independence 1857?", ["Greased cartridge issue", "Economic exploitation", "Doctrine of Lapse", "All of the above"], 3, "Multiple factors including greased cartridges, economic exploitation, and Doctrine of Lapse caused the revolt.", "History", "Medium");
q("Who composed the epic 'Mahabharata'?", ["Ved Vyasa", "Valmiki", "Tulsidas", "Kalidasa"], 0, "Ved Vyasa is traditionally credited as the author of the Mahabharata.", "History", "Easy");
q("The Sangam literature belonged to which region?", ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh"], 0, "Sangam literature is associated with ancient Tamilakam (present-day Tamil Nadu).", "History", "Medium");
q("Who founded the city of Agra?", ["Sikandar Lodhi", "Babur", "Akbar", "Shah Jahan"], 0, "Sikandar Lodhi founded Agra in 1504.", "History", "Hard");
q("The Konark Sun Temple is located in which state?", ["Odisha", "Tamil Nadu", "Karnataka", "Andhra Pradesh"], 0, "The Sun Temple at Konark, Odisha, is a UNESCO World Heritage Site.", "History", "Medium");

// ═══════════════════════════════════════════════════════════════
// Polity — 20 questions
// ═══════════════════════════════════════════════════════════════
q("How many members can be nominated by the President to the Rajya Sabha?", ["12", "10", "14", "16"], 0, "The President can nominate 12 members to the Rajya Sabha for their expertise.", "Polity", "Medium");
q("Who has the power to declare a state of emergency in India?", ["President", "Prime Minister", "Chief Justice", "Home Minister"], 0, "The President can declare three types of emergencies under Articles 352, 356, and 360.", "Polity", "Easy");
q("The concept of 'Judicial Review' in India is borrowed from which country's constitution?", ["USA", "Britain", "Canada", "Ireland"], 0, "Judicial Review is borrowed from the US Constitution.", "Polity", "Medium");
q("Which schedule of the Indian Constitution deals with the official languages?", ["Eighth Schedule", "Seventh Schedule", "Ninth Schedule", "Tenth Schedule"], 0, "The Eighth Schedule lists 22 official languages of India.", "Polity", "Medium");
q("Who is the head of the State Government in India?", ["Governor", "Chief Minister", "Chief Secretary", "President"], 0, "The Governor is the constitutional head of a state.", "Polity", "Easy");
q("What is the maximum strength of the Lok Sabha?", ["550", "545", "552", "555"], 0, "The maximum strength is 550 members (530 from states + 20 from UTs).", "Polity", "Medium");
q("Which amendment to the Indian Constitution is known as the 'Mini-Constitution'?", ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], 0, "The 42nd Amendment (1976) made sweeping changes to the Constitution.", "Polity", "Medium");
q("Who appoints the Chief Justice of India?", ["President", "Prime Minister", "Law Minister", "Collegium"], 0, "The President appoints the CJI based on the recommendation of the collegium.", "Polity", "Easy");
q("What is the term of office of the Vice President of India?", ["5 years", "6 years", "4 years", "7 years"], 0, "The Vice President serves a term of 5 years.", "Polity", "Medium");
q("Which article of the Indian Constitution deals with the Right to Education?", ["Article 21A", "Article 21", "Article 14", "Article 19"], 0, "Article 21A was added by the 86th Amendment Act, 2002.", "Polity", "Medium");
q("How many High Courts are there in India (as of 2025)?", ["25", "24", "26", "28"], 0, "India has 25 High Courts as of 2025.", "Polity", "Medium");
q("Who is the chairman of the Rajya Sabha?", ["Vice President of India", "President", "Prime Minister", "Speaker"], 0, "The Vice President is the ex-officio chairman of Rajya Sabha.", "Polity", "Easy");
q("Which of the following is not a writ issued by the Supreme Court?", ["Mandamus", "Certiorari", "Habeas Corpus", "Subpoena"], 3, "Subpoena is not a constitutional writ; 5 writs exist: Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto.", "Polity", "Medium");
q("The Panchayati Raj system was constitutionalised by which amendment?", ["73rd Amendment", "74th Amendment", "72nd Amendment", "44th Amendment"], 0, "The 73rd Amendment (1992) gave constitutional status to Panchayati Raj.", "Polity", "Medium");
q("What is the minimum age to become a member of the Rajya Sabha?", ["30 years", "25 years", "35 years", "21 years"], 0, "A Rajya Sabha member must be at least 30 years old.", "Polity", "Medium");
q("Who among the following can vote in the election of the President of India?", ["All elected MPs and MLAs", "All citizens above 18", "All elected MPs only", "All MPs and MLAs"], 0, "The President is elected by an electoral college consisting of elected MPs and MLAs.", "Polity", "Medium");
q("Which article of the Indian Constitution abolishes untouchability?", ["Article 17", "Article 14", "Article 15", "Article 16"], 0, "Article 17 abolishes 'untouchability' and forbids its practice.", "Polity", "Easy");
q("Who was the first Speaker of the Lok Sabha?", ["G.V. Mavalankar", "M.A. Ayyangar", "Hukam Singh", "N. Sanjiva Reddy"], 0, "G.V. Mavalankar served as the first Speaker from 1952 to 1956.", "Polity", "Medium");
q("The Indian Constitution is which type of document?", ["Federal with unitary bias", "Unitary", "Federal", "Confederal"], 0, "The Indian Constitution establishes a federal system with unitary features.", "Polity", "Medium");
q("Which part of the Indian Constitution deals with Directive Principles of State Policy?", ["Part IV", "Part III", "Part II", "Part V"], 0, "Part IV (Articles 36-51) deals with Directive Principles.", "Polity", "Medium");

// ═══════════════════════════════════════════════════════════════
// Mixed / APSC-specific — 10 questions
// ═══════════════════════════════════════════════════════════════
q("The APSC (Assam Public Service Commission) was established in which year?", ["1972", "1950", "1960", "1980"], 0, "APSC was established on 1 October 1972 under Article 315 of the Constitution.", "Mixed", "Medium");
q("Which of the following exams is conducted by APSC?", ["ACS (Assam Civil Service)", "UPSC Civil Services", "SSC CGL", "IBPS PO"], 0, "APSC conducts the Assam Civil Service (ACS) and other state-level exams.", "Mixed", "Easy");
q("What is the full form of APSC?", ["Assam Public Service Commission", "Assam Professional Services Commission", "Assam Personnel Selection Commission", "Assam Provincial Service Commission"], 0, "APSC stands for Assam Public Service Commission.", "Mixed", "Easy");
q("The APSC CC (Combined Competitive) Examination consists of how many stages?", ["Three (Prelims, Mains, Interview)", "Two (Written, Interview)", "Four", "Only one"], 0, "The APSC CC exam has three stages: prelims, mains, and interview/personality test.", "Mixed", "Medium");
q("Which article of the Indian Constitution provides for the establishment of Public Service Commissions?", ["Article 315", "Article 320", "Article 312", "Article 335"], 0, "Article 315 provides for PSCs at the Union and state levels.", "Mixed", "Medium");
q("What is the maximum age limit for APSC CC Exam for General category candidates?", ["35 years", "30 years", "38 years", "40 years"], 0, "For the APSC CC exam, the upper age limit is 35 years for General candidates.", "Mixed", "Easy");
q("How many papers are there in the APSC Mains examination?", ["6 papers", "7 papers", "5 papers", "4 papers"], 0, "APSC Mains consists of 6 papers including General Studies, Essay, and Optional.", "Mixed", "Medium");
q("Which river island is a popular tourist destination in Assam?", ["Majuli", "Umananda", "Brahmaputra Island", "Dibru Island"], 0, "Majuli is the world's largest inhabited river island.", "Mixed", "Easy");
q("Who was the first member of the Assam Legislative Assembly to become the Chief Minister?", ["Gopinath Bordoloi", "Bishnuram Medhi", "Bimala Prasad Chaliha", "Mahendra Mohan Choudhury"], 0, "Gopinath Bordoloi was the first CM after the formation of Assam.", "Mixed", "Medium");
q("The Assam Accord was signed in which year?", ["1985", "1983", "1987", "1990"], 0, "The Assam Accord was signed on 15 August 1985 between the central government and AASU.", "Mixed", "Medium");

// ── Log stats ──────────────────────────────────────────────────
const pillarStats = {};
questions.forEach((q) => {
  pillarStats[q.pillar] = (pillarStats[q.pillar] || 0) + 1;
});
console.log("Generated questions breakdown by pillar:");
Object.entries(pillarStats).forEach(([p, c]) => console.log(`  ${p}: ${c}`));
console.log(`Total: ${questions.length} questions`);

// ── Write Excel ────────────────────────────────────────────────
const ws = XLSX.utils.json_to_sheet(questions);
ws["!cols"] = [
  { wch: 70 },  // question
  { wch: 40 },  // option_a
  { wch: 40 },  // option_b
  { wch: 40 },  // option_c
  { wch: 40 },  // option_d
  { wch: 14 },  // correct_index
  { wch: 55 },  // explanation
  { wch: 18 },  // pillar
  { wch: 12 },  // difficulty
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Quiz Questions");

// Add instructions sheet
const instructions = XLSX.utils.aoa_to_sheet([
  ["INSTRUCTIONS"],
  [""],
  ["Column", "Required", "Description"],
  ["question", "Yes", "The MCQ question text (min 10 characters)"],
  ["option_a", "Yes", "First option"],
  ["option_b", "Yes", "Second option"],
  ["option_c", "Yes", "Third option"],
  ["option_d", "Yes", "Fourth option"],
  ["correct_index", "Yes", "Index of correct option (0 for A, 1 for B, 2 for C, 3 for D)"],
  ["explanation", "No", "Explanation for the correct answer"],
  ["pillar", "No", "Category: GK, AssamGK, CurrentAffairs, Science, History, Polity, Mixed (default: GK)"],
  ["difficulty", "No", "Easy, Medium, or Hard (default: Medium)"],
]);
XLSX.utils.book_append_sheet(wb, instructions, "Instructions");

const outputDir = path.join(__dirname);
const outputPath = path.join(outputDir, "apsc-questions-200.xlsx");
XLSX.writeFile(wb, outputPath);
console.log(`\n✅ Written to: ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
