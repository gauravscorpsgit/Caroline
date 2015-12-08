'use strict';

angular.module('mean.freelancer',['ui-notification','angucomplete-alt']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope',
    function($scope, Global, Freelancer, Notification, $rootScope) {
        $scope.global = Global;
        $scope.package = {
            name: 'freelancer'
        };

        $scope.landing_editable = false;
        $scope.enableChanges = function(){
            $scope.landing_editable = !$scope.landing_editable;
        };

        $scope.addSkills = function(){
            var skill ={name : 'New Skill', percentage:50};
            $scope.landing_info.user_skills.push(skill);
        };

        $scope.removeSkill = function(index){
            $scope.landing_info.user_skills.splice( index, 1 );
        };

        $scope.Search_initial = true;
        $scope.Search_success = true;
        $scope.worker = {email:''};
        $scope.getCoworker = function(){
            $scope.Search_initial = true;
            $scope.Search_success = true;
            Freelancer.getWorker_resource.get($scope.worker,function(response,header,error){
                if(response.success){
                    $scope.Search_initial = false;
                    console.log(response);
                    $scope.freelancer_worker = response.freelancer_object;
                }
                else{
                    console.log('there is an issue');
                    $scope.Search_success = false;
                }
            })
        };


        $scope.addWorker =function(id){

            Freelancer.addWorker_resource.put(id, function(response,header,error) {
                if(response.success){
                    Notification.success('Email has been saved');
                }

                else{
                    Notification.error('There was an issue, Please try again');
                }
            })

        };


        $scope.email_search = function(){

            Freelancer.getSearchEmail_resource.get({searchEmail_id:$scope.emailForm.to_user},function(response,header,error){
                if(response.success){
                    console.log(response);
                }
                else{
                    console.log('there is an issue');
                }
            })
        };

        $scope.updateFreelancerLanding = function(){
            Freelancer.freelancer_details_resource.update($scope.landing_info,function(response,header,error){
                if(response.success){
                    Notification.success('Freelancer details updated successfully.');
                    $scope.landing_editable = false;
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });
        };

        $scope.getFreelancerDetails = function(){
            Freelancer.freelancer_details_resource.get(function(response,header,error){
                if(response.success){
                    $scope.landing_info = response.freelancer_object[0];
                    if($scope.landing_info.user_intro.profile_image.indexOf('filepicker.io') > -1)
                        $scope.landing_info.user_intro.profile_image = $scope.landing_info.user_intro.profile_image;
                    Notification.success('Freelancer details fetched');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });
        };

        $scope.activeTemplate = 'freelancer/views/compose_email.html';
        $rootScope.$on('openCompose', function(){
            $scope.activeTemplate = 'freelancer/views/compose_email.html';
        });

        $rootScope.$on('openInbox', function(){
            $scope.activeTemplate = 'freelancer/views/email_inbox.html';
        });''

        $rootScope.$on('free_landing_demo', function(){
            $scope.activeTemplate = 'freelancer/views/freelancer_demo_page.html';
        });

        $rootScope.$on('Add_CoWorker', function(){
            $scope.activeTemplate = 'freelancer/views/add_worker.html';
        });


        $scope.emailForm = {
            to_user:'',
            subject:'',
            content:''
        };

        $scope.openComposePage = function(){
            $scope.activeTemplate = 'freelancer/views/compose_email.html';
        };

        $scope.getInboxMessage = function(){
            Freelancer.compose_resource.get(function(response,header,error) {
                if(response.success){
                    $scope.user_emails = response.emails;
                    Notification.success('Emails fetched successfully');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });

        };

        $scope.product_skeleton = {
            title : '',
            description:'',
            image : '',
            price : ''
        };

        $scope.pushFirstProduct = function(){
            if($scope.product_skeleton.title.length > 0 && $scope.product_skeleton.image.length > 0 && $scope.product_skeleton.description.length > 0  && $scope.product_skeleton.price.length != 0){
                /* $scope.landing_info.products.push();
                 Notification.success('Save changes to make the persistent.');*/

                Freelancer.product_resource.save($scope.product_skeleton, function(response,header, error){
                    console.log(response);
                    if(response.success){
                        $scope.landing_info.products.push(response.product_object);
                        Notification.success('Service created, save changes to make the persistent.');
                    }
                    else{
                        Notification.error('There was an issue, Please try again');
                    }


                });
            }
        };
        $scope.removeProduct = function(index){
            $scope.landing_info.products.splice(index, 1);
        };


        $scope.openProductPicDialog = function(index, is_intial){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    if(is_intial){
                        $scope.product_skeleton.image = Blobs[0].url;
                    }
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        };



        $scope.portfolio_skeleton = {
            title : '',
            image : ''
        };

        $scope.pushFirstPortfolio = function(){
            if($scope.portfolio_skeleton.title.length > 0 && $scope.portfolio_skeleton.image.length > 0){
                $scope.landing_info.portfolio.push($scope.portfolio_skeleton);
                Notification.success('Save changes to make the persistent.');
                $scope.$apply();
            }
        };

        $scope.removePortfolio = function(index){
            $scope.landing_info.portfolio.splice(index, 1);
        };


        $scope.openPortfolioPicDialog = function(index, is_intial){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    if(is_intial){
                        $scope.portfolio_skeleton.image = Blobs[0].url;
                    }
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        };

        $scope.openProfilePicDialog = function(){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1

                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.landing_info.user_intro.profile_image = Blobs[0].url;
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        }


        $scope.openUploadDialog = function(){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.uploaded_files_array = Blobs;
                    $scope.uploadDone= true;
                    $scope.emailForm.content= $scope.emailForm.content +' Attachment: '+ Blobs[0].url;
                    $scope.$apply();

                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        }

        $scope.email_form = function(){
            Freelancer.compose_resource.post($scope.emailForm, function(response,header,error) {
                if(response.success){
                    Notification.success('Email has been saved and sent to '+ $scope.emailForm.to_user);

                    $scope.emailForm.to_user='';
                    $scope.emailForm.subject='';
                    $scope.emailForm.content='';
                }

                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };

        $scope.indian_cities = {data:[{name : 'Agra'},{name:'Bengaluru'},{name : 'Ahmedabad'},{name : 'Alappuzha'},{name : 'Alwar'},{name : 'Amritsar'},{name : 'Aurangabad'},{name : 'Bangalore'},{name : 'Bharatpur'},{name : 'Bhavnagar'},{name : 'Bhikaner'},{name : 'Bhopal'},{name : 'Bhubaneshwar'},{name : 'Bodh Gaya'},{name : 'Calangute'},{name : 'Chandigarh'},{name : 'Chennai'},{name : 'Chittaurgarh'},{name : 'Coimbatore'},{name : 'Cuttack'},{name : 'Dalhousie'},{name : 'Dehradun'},{name : 'Delhi'},{name : 'Diu-Island'},{name : 'Ernakulam'},{name : 'Faridabad'},{name : 'Gaya'},{name : 'Gangtok'},{name : 'Ghaziabad'},{name : 'Gurgaon'},{name : 'Guwahati'},{name : 'Gwalior'},{name : 'Haridwar'},{name : 'Hyderabad'},{name : 'Imphal'},{name : 'Indore'},{name : 'Jabalpur'},{name : 'Jaipur'},{name : 'Jaisalmer'},{name : 'Jalandhar'},{name : 'Jamshedpur'},{name : 'Jodhpur'},{name : 'Junagadh'},{name : 'Kanpur'},{name : 'Kanyakumari'},{name : 'Khajuraho'},{name : 'Khandala'},{name : 'Kochi'},{name : 'Kodaikanal'},{name : 'Kolkata'},{name : 'Kota'},{name : 'Kottayam'},{name : 'Kovalam'},{name : 'Lucknow'},{name : 'Ludhiana'},{name : 'Madurai'},{name : 'Manali'},{name : 'Mangalore'},{name : 'Margao'},{name : 'Mathura'},{name : 'Mountabu'},{name : 'Mumbai'},{name : 'Mussoorie'},{name : 'Mysore'},{name : 'Manali'},{name : 'Nagpur'},{name : 'Nainital'},{name : 'Noida'},{name : 'Ooty'},{name : 'Orchha'},{name : 'Panaji'},{name : 'Patna'},{name : 'Pondicherry'},{name : 'Porbandar'},{name : 'Portblair'},{name : 'Pune'},{name : 'Puri'},{name : 'Pushkar'},{name : 'Rajkot'},{name : 'Rameswaram'},{name : 'Ranchi'},{name : 'Sanchi'},{name : 'Secunderabad'},{name : 'Shimla'},{name : 'Surat'},{name : 'Thanjavur'},{name : 'Thiruchchirapalli'},{name : 'Thrissur'},{name : 'Tirumala'},{name : 'Udaipur'},{name : 'Vadodra'},{name : 'Varanasi'},{name : 'Vasco-Da-Gama'},{name : 'Vijayawada'},{name : 'Visakhapatnam'},{name : 'Nicobar'},{name : 'North and Middle Andaman'},{name : 'South Andaman'},{name : 'Anjaw'},{name : 'Changlang'},{name : 'Dibang Valley'},{name : 'East Kameng'},{name : 'East Siang'},{name : 'Kurung Kumey'},{name : 'Lohit'},{name : 'Lower Dibang Valley'},{name : 'Lower Subansiri'},{name : 'Papum Pare'},{name : 'Tawang'},{name : 'Tirap'},{name : 'Upper Siang'},{name : 'Upper Subansiri'},{name : 'West Kameng'},{name : 'West Siang'},{name : 'Baksa'},{name : 'Barpeta'},{name : 'Bongaigaon'},{name : 'Cachar'},{name : 'Chirang'},{name : 'Darrang'},{name : 'Dhemaji'},{name : 'Dhubri'},{name : 'Dibrugarh'},{name : 'Dima Hasao'},{name : 'Goalpara'},{name : 'Golaghat'},{name : 'Hailakandi'},{name : 'Jorhat'},{name : 'Kamrup Metropolitan'},{name : 'Kamrup'},{name : 'Karbi Anglong'},{name : 'Karimganj'},{name : 'Kokrajhar'},{name : 'Lakhimpur'},{name : 'Morigaon'},{name : 'Nagaon'},{name : 'Nalbari'},{name : 'Sivasagar'},{name : 'Sonitpur'},{name : 'Tinsukia'},{name : 'Udalguri'},{name : 'Araria'},{name : 'Arwal'},{name : 'Aurangabad'},{name : 'Banka'},{name : 'Begusarai'},{name : 'Bhagalpur'},{name : 'Bhojpur'},{name : 'Buxar'},{name : 'Darbhanga'},{name : 'East Champaran (Motihari)'},{name : 'Gaya'},{name : 'Gopalganj'},{name : 'Jamui'},{name : 'Jehanabad'},{name : 'Kaimur (Bhabua)'},{name : 'Katihar'},{name : 'Khagaria'},{name : 'Kishanganj'},{name : 'Lakhisarai'},{name : 'Madhepura'},{name : 'Madhubani'},{name : 'Munger (Monghyr)'},{name : 'Muzaffarpur'},{name : 'Nalanda'},{name : 'Nawada'},{name : 'Patna'},{name : 'Purnia (Purnea)'},{name : 'Rohtas'},{name : 'Saharsa'},{name : 'Samastipur'},{name : 'Saran'},{name : 'Sheikhpura'},{name : 'Sheohar'},{name : 'Sitamarhi'},{name : 'Siwan'},{name : 'Supaul'},{name : 'Vaishali'},{name : 'West Champaran'},{name : 'Chandigarh'},{name : 'Bijapur'},{name : 'Bilaspur'},{name : 'Dantewada (South Bastar)'},{name : 'Dhamtari'},{name : 'Durg'},{name : 'Janjgir-Champa'},{name : 'Jashpur'},{name : 'Kabirdham (Kawardha)'},{name : 'Kanker (North Bastar)'},{name : 'Korba'},{name : 'Korea (Koriya)'},{name : 'Mahasamund'},{name : 'Narayanpur'},{name : 'Raigarh'},{name : 'Raipur'},{name : 'Rajnandgaon'},{name : 'Surguja'},{name : 'Dadra & Nagar Haveli'},{name : 'Daman'},{name : 'Diu'},{name : 'Central Delhi'},{name : 'East Delhi'},{name : 'New Delhi'},{name : 'North Delhi'},{name : 'North East Delhi'},{name : 'North West Delhi'},{name : 'South Delhi'},{name : 'South West Delhi'},{name : 'West Delhi'},{name : 'North Goa'},{name : 'South Goa'},{name : 'Ahmedabad'},{name : 'Amreli'},{name : 'Anand'},{name : 'Banaskantha (Palanpur)'},{name : 'Bharuch'},{name : 'Bhavnagar'},{name : 'Dahod'},{name : 'Dangs (Ahwa)'},{name : 'Gandhinagar'},{name : 'Jamnagar'},{name : 'Junagadh'},{name : 'Kachchh'},{name : 'Kheda (Nadiad)'},{name : 'Mehsana'},{name : 'Narmada (Rajpipla)'},{name : 'Navsari'},{name : 'Panchmahal (Godhra)'},{name : 'Patan'},{name : 'Porbandar'},{name : 'Rajkot'},{name : 'Sabarkantha (Himmatnagar)'},{name : 'Surat'},{name : 'Surendranagar'},{name : 'Tapi (Vyara)'},{name : 'Vadodara'},{name : 'Valsad'},{name : 'Ambala'},{name : 'Bhiwani'},{name : 'Faridabad'},{name : 'Fatehabad'},{name : 'Gurgaon'},{name : 'Hisar'},{name : 'Jhajjar'},{name : 'Jind'},{name : 'Kaithal'},{name : 'Karnal'},{name : 'Kurukshetra'},{name : 'Mahendragarh'},{name : 'Mewat'},{name : 'Palwal'},{name : 'Panchkula'},{name : 'Panipat'},{name : 'Rewari'},{name : 'Rohtak'},{name : 'Sirsa'},{name : 'Sonipat'},{name : 'Yamunanagar'},{name : 'Chamba'},{name : 'Hamirpur'},{name : 'Kangra'},{name : 'Kinnaur'},{name : 'Kullu'},{name : 'Lahaul & Spiti'},{name : 'Mandi'},{name : 'Shimla'},{name : 'Sirmaur (Sirmour)'},{name : 'Solan'},{name : 'Una'},{name : 'Anantnag'},{name : 'Bandipora'},{name : 'Baramulla'},{name : 'Budgam'},{name : 'Doda'},{name : 'Ganderbal'},{name : 'Jammu'},{name : 'Kargil'},{name : 'Kathua'},{name : 'Kishtwar'},{name : 'Kulgam'},{name : 'Kupwara'},{name : 'Leh'},{name : 'Poonch'},{name : 'Pulwama'},{name : 'Rajouri'},{name : 'Ramban'},{name : 'Reasi'},{name : 'Samba'},{name : 'Shopian'},{name : 'Srinagar'},{name : 'Udhampur'},{name : 'Bokaro'},{name : 'Chatra'},{name : 'Deoghar'},{name : 'Dhanbad'},{name : 'Dumka'},{name : 'East Singhbhum'},{name : 'Garhwa'},{name : 'Giridih'},{name : 'Godda'},{name : 'Gumla'},{name : 'Hazaribag'},{name : 'Jamtara'},{name : 'Khunti'},{name : 'Koderma'},{name : 'Latehar'},{name : 'Lohardaga'},{name : 'Pakur'},{name : 'Palamu'},{name : 'Ramgarh'},{name : 'Ranchi'},{name : 'Sahibganj'},{name : 'Seraikela-Kharsawan'},{name : 'Simdega'},{name : 'Bagalkot'},{name : 'Bangalore Rural'},{name : 'Bangalore Urban'},{name : 'Belgaum'},{name : 'Bellary'},{name : 'Bidar'},{name : 'Chamarajanagar'},{name : 'Chickmagalur'},{name : 'Chikballapur'},{name : 'Chitradurga'},{name : 'Dakshina Kannada'},{name : 'Davangere'},{name : 'Dharwad'},{name : 'Gadag'},{name : 'Gulbarga'},{name : 'Hassan'},{name : 'Haveri'},{name : 'Kodagu'},{name : 'Kolar'},{name : 'Koppal'},{name : 'Mandya'},{name : 'Mysore'},{name : 'Raichur'},{name : 'Ramnagara'},{name : 'Shimoga'},{name : 'Tumkur'},{name : 'Udupi'},{name : 'Uttara Kannada (Karwar)'},{name : 'Yadgir'},{name : 'Alappuzha'},{name : 'Ernakulam'},{name : 'Idukki'},{name : 'Kannur'},{name : 'Kasaragod'},{name : 'Kollam'},{name : 'Kottayam'},{name : 'Kozhikode'},{name : 'Malappuram'},{name : 'Palakkad'},{name : 'Pathanamthitta'},{name : 'Thiruvananthapuram'},{name : 'Thrissur'},{name : 'Wayanad'},{name : 'Lakshadweep'},{name : 'Alirajpur'},{name : 'Anuppur'},{name : 'Ashoknagar'},{name : 'Balaghat'},{name : 'Barwani'},{name : 'Betul'},{name : 'Bhind'},{name : 'Bhopal'},{name : 'Burhanpur'},{name : 'Chhatarpur'},{name : 'Chhindwara'},{name : 'Damoh'},{name : 'Datia'},{name : 'Dewas'},{name : 'Dhar'},{name : 'Dindori'},{name : 'Guna'},{name : 'Gwalior'},{name : 'Harda'},{name : 'Hoshangabad'},{name : 'Indore'},{name : 'Jabalpur'},{name : 'Jhabua'},{name : 'Katni'},{name : 'Khandwa'},{name : 'Khargone'},{name : 'Mandla'},{name : 'Mandsaur'},{name : 'Morena'},{name : 'Narsinghpur'},{name : 'Neemuch'},{name : 'Panna'},{name : 'Raisen'},{name : 'Rajgarh'},{name : 'Ratlam'},{name : 'Rewa'},{name : 'Sagar'},{name : 'Satna'},{name : 'Sehore'},{name : 'Seoni'},{name : 'Shahdol'},{name : 'Shajapur'},{name : 'Sheopur'},{name : 'Shivpuri'},{name : 'Sidhi'},{name : 'Singrauli'},{name : 'Tikamgarh'},{name : 'Ujjain'},{name : 'Umaria'},{name : 'Vidisha'},{name : 'Ahmednagar'},{name : 'Akola'},{name : 'Amravati'},{name : 'Beed'},{name : 'Buldhana'},{name : 'Chandrapur'},{name : 'Dhule'},{name : 'Gadchiroli'},{name : 'Gondia'},{name : 'Hingoli'},{name : 'Jalgaon'},{name : 'Jalna'},{name : 'Kolhapur'},{name : 'Latur'},{name : 'Nagpur'},{name : 'Nanded'},{name : 'Nandurbar'},{name : 'Nashik'},{name : 'Osmanabad'},{name : 'Parbhani'},{name : 'Pune'},{name : 'Raigad'},{name : 'Ratnagiri'},{name : 'Sangli'},{name : 'Satara'},{name : 'Sindhudurg'},{name : 'Solapur'},{name : 'Thane'},{name : 'Wardha'},{name : 'Washim'},{name : 'Yavatmal'},{name : 'Bishnupur'},{name : 'Chandel'},{name : 'Churachandpur'},{name : 'Imphal East'},{name : 'Imphal West'},{name : 'Senapati'},{name : 'Tamenglong'},{name : 'Thoubal'},{name : 'Ukhrul'},{name : 'East Garo Hills'},{name : 'East Khasi Hills'},{name : 'Ri Bhoi'},{name : 'South Garo Hills'},{name : 'West Garo Hills'},{name : 'West Khasi Hills'},{name : 'Aizawl'},{name : 'Champhai'},{name : 'Kolasib'},{name : 'Lawngtlai'},{name : 'Lunglei'},{name : 'Mamit'},{name : 'Saiha'},{name : 'Serchhip'},{name : 'Dimapur'},{name : 'Kiphire'},{name : 'Kohima'},{name : 'Longleng'},{name : 'Mokokchung'},{name : 'Mon'},{name : 'Peren'},{name : 'Phek'},{name : 'Tuensang'},{name : 'Wokha'},{name : 'Zunheboto'},{name : 'Angul'},{name : 'Balangir'},{name : 'Balasore'},{name : 'Bargarh'},{name : 'Bhadrak'},{name : 'Boudh'},{name : 'Cuttack'},{name : 'Deogarh'},{name : 'Dhenkanal'},{name : 'Gajapati'},{name : 'Ganjam'},{name : 'Jagatsinghapur'},{name : 'Jajpur'},{name : 'Jharsuguda'},{name : 'Kalahandi'},{name : 'Kandhamal'},{name : 'Kendrapara'},{name : 'Kendujhar (Keonjhar)'},{name : 'Khordha'},{name : 'Koraput'},{name : 'Malkangiri'},{name : 'Mayurbhanj'},{name : 'Nabarangpur'},{name : 'Nayagarh'},{name : 'Nuapada'},{name : 'Puri'},{name : 'Rayagada'},{name : 'Sambalpur'},{name : 'Sonepur'},{name : 'Sundargarh'},{name : 'Karaikal'},{name : 'Mahe'},{name : 'Pondicherry'},{name : 'Yanam'},{name : 'Amritsar'},{name : 'Barnala'},{name : 'Bathinda'},{name : 'Faridkot'},{name : 'Fatehgarh Sahib'},{name : 'Ferozepur'},{name : 'Gurdaspur'},{name : 'Hoshiarpur'},{name : 'Jalandhar'},{name : 'Kapurthala'},{name : 'Ludhiana'},{name : 'Mansa'},{name : 'Moga'},{name : 'Muktsar'},{name : 'Patiala'},{name : 'Rupnagar'},{name : 'Sangrur'},{name : 'SAS Nagar (Mohali)'},{name : 'Tarn Taran'},{name : 'Ajmer'},{name : 'Alwar'},{name : 'Baran'},{name : 'Barmer'},{name : 'Bharatpur'},{name : 'Bhilwara'},{name : 'Bikaner'},{name : 'Bundi'},{name : 'Chittorgarh'},{name : 'Churu'},{name : 'Dausa'},{name : 'Dungarpur'},{name : 'Hanumangarh'},{name : 'Jaipur'},{name : 'Jaisalmer'},{name : 'Jalore'},{name : 'Jhalawar'},{name : 'Jhunjhunu'},{name : 'Jodhpur'},{name : 'Karauli'},{name : 'Nagaur'},{name : 'Pali'},{name : 'Pratapgarh'},{name : 'Rajsamand'},{name : 'Sawai Madhopur'},{name : 'Sikar'},{name : 'Sirohi'},{name : 'Sri Ganganagar'},{name : 'Tonk'},{name : 'East Sikkim'},{name : 'North Sikkim'},{name : 'South Sikkim'},{name : 'West Sikkim'},{name : 'Ariyalur'},{name : 'Chennai'},{name : 'Coimbatore'},{name : 'Cuddalore'},{name : 'Dharmapuri'},{name : 'Dindigul'},{name : 'Erode'},{name : 'Kanchipuram'},{name : 'Kanyakumari'},{name : 'Karur'},{name : 'Krishnagiri'},{name : 'Madurai'},{name : 'Nagapattinam'},{name : 'Namakkal'},{name : 'Nilgiris'},{name : 'Perambalur'},{name : 'Pudukkottai'},{name : 'Ramanathapuram'},{name : 'Salem'},{name : 'Sivaganga'},{name : 'Thanjavur'},{name : 'Theni'},{name : 'Thoothukudi (Tuticorin)'},{name : 'Tiruchirappalli'},{name : 'Tirunelveli'},{name : 'Tiruppur'},{name : 'Tiruvallur'},{name : 'Tiruvannamalai'},{name : 'Tiruvarur'},{name : 'Vellore'},{name : 'Viluppuram'},{name : 'Virudhunagar'},{name : 'Dhalai'},{name : 'North Tripura'},{name : 'South Tripura'},{name : 'West Tripura'},{name : 'Agra'},{name : 'Aligarh'},{name : 'Allahabad'},{name : 'Ambedkar Nagar'},{name : 'Auraiya'},{name : 'Azamgarh'},{name : 'Baghpat'},{name : 'Bahraich'},{name : 'Ballia'},{name : 'Balrampur'},{name : 'Banda'},{name : 'Barabanki'},{name : 'Bareilly'},{name : 'Basti'},{name : 'Bijnor'},{name : 'Budaun'},{name : 'Bulandshahr'},{name : 'Chandauli'},{name : 'Chitrakoot'},{name : 'Deoria'},{name : 'Etah'},{name : 'Etawah'},{name : 'Faizabad'},{name : 'Farrukhabad'},{name : 'Fatehpur'},{name : 'Firozabad'},{name : 'Gautam Buddha Nagar'},{name : 'Ghaziabad'},{name : 'Ghazipur'},{name : 'Gonda'},{name : 'Gorakhpur'},{name : 'Hardoi'},{name : 'Jalaun'},{name : 'Jaunpur'},{name : 'Jhansi'},{name : 'Jyotiba Phule Nagar (J.P. Nagar)'},{name : 'Kannauj'},{name : 'Kanpur Dehat'},{name : 'Kanpur Nagar'},{name : 'Kanshiram Nagar (Kasganj)'},{name : 'Kaushambi'},{name : 'Kushinagar (Padrauna)'},{name : 'Lakhimpur - Kheri'},{name : 'Lalitpur'},{name : 'Lucknow'},{name : 'Maharajganj'},{name : 'Mahoba'},{name : 'Mainpuri'},{name : 'Mathura'},{name : 'Mau'},{name : 'Meerut'},{name : 'Mirzapur'},{name : 'Moradabad'},{name : 'Muzaffarnagar'},{name : 'Panchsheel Nagar'},{name : 'Pilibhit'},{name : 'Prabuddh Nagar'},{name : 'RaeBareli'},{name : 'Rampur'},{name : 'Saharanpur'},{name : 'Sant Kabir Nagar'},{name : 'Sant Ravidas Nagar'},{name : 'Shahjahanpur'},{name : 'Shravasti'},{name : 'Siddharth Nagar'},{name : 'Sitapur'},{name : 'Sonbhadra'},{name : 'Sultanpur'},{name : 'Unnao'},{name : 'Varanasi'},{name : 'Almora'},{name : 'Bageshwar'},{name : 'Chamoli'},{name : 'Champawat'},{name : 'Dehradun'},{name : 'Haridwar'},{name : 'Nainital'},{name : 'Pauri Garhwal'},{name : 'Pithoragarh'},{name : 'Rudraprayag'},{name : 'Tehri Garhwal'},{name : 'Udham Singh Nagar'},{name : ''},{name : 'Uttarkashi'},{name : 'Bankura'},{name : 'Birbhum'},{name : 'Burdwan (Bardhaman)'},{name : 'Cooch Behar'},{name : 'Dakshin Dinajpur (South Dinajpur)'},{name : 'Darjeeling'},{name : 'Hooghly'},{name : 'Howrah'},{name : 'Jalpaiguri'},{name : 'Malda'},{name : 'Murshidabad'},{name : 'Nadia'},{name : 'North 24 Parganas'},{name : 'Paschim Medinipur (West Medinipur)'},{name : 'Purba Medinipur (East Medinipur)'},{name : 'Purulia'},{name : 'South 24 Parganas'},{name : 'Uttar Dinajpur (North Dinajpur)'}]};

    }]);
