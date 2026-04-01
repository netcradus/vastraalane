import React, { useState } from "react";
import "../scss/_productDetail.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import axios from 'axios';

// Import all images
import CalvinKlein from "../Videos/1.jpeg";
import DavidBeckham from "../Videos/2.jpeg";
import DolceGabbana from "../Videos/3.jpeg";
import Gucci from "../Videos/4.jpeg";
import AdidasBeigeCopy2 from "../Videos/5.jpeg";
import AdidasBeige from "../Videos/6.jpeg";
import AdidasBlackCopy2 from "../Videos/7.jpeg";
import AdidasGrey from "../assets/Adida s Light Grey Embroidery Logo Premium Trackpant.png";
import AdidasOlive from "../assets/Adida s Olive Embroidery Logo Premium Trackpant.png";
import AdidasRed from "../assets/Adida s Red Logo Print Premium Imported Tracksuit.png";
import AdidasYeezyBoost350V2CarbonBeluga from "../assets/Adida_ss Yeezy Boost 350 V2 Carbon Beluga SEMI UA With All Accesories .png";
import ADIDAS from "../assets/ADIDAS.jpg";
import AdidasFearOfGodAthletic1 from "../assets/Adidass Fear Of God Athletic 1 Indiana.png";
import AdidasYeezySlidesBone from "../assets/Adiddas Yeezy Slides Bone Ua.png";
import AdidasFoamRunnerOnyx from "../assets/Aidddas Foam Runner Onyx Ua - Copy (3).png";
import AirJordanCordSet from "../assets/Air Jordan Cream Premium Oversized Cord Set - Copy (2).png";
import AlexanderMcQueenWhite from "../assets/ALEXANDER MCQUEEN PREMIUM WHITE SNEAKER.png";
import BalmainDenimShirt from "../assets/Balmai n Paris Logo Blue Super Premium Denim Shirt F2732-B33 - Copy (2).png";
import BirkenstockArizonaBlack from "../assets/BIRKENSTOCK ARIZONA EVA BLACK - Copy (2).png";
import DiorJAdiorSlingback from "../assets/Christian_Dior_JAdior_Slingback_Black_Dior_Embroidery_Flat_With_OG_Box_Dust_Bag_&_Carry_Bag_5108_Black - Copy.png";
import CoachCollinsEspadrille from "../assets/Coach_Collins_Espadrille_In_Signature_Denim_With_OG_Box_&_Carry_Bag_888-21_Denim - Copy.jpg";
import CrocsLiterideBlackWhite from "../assets/Croc s literide Black White - Copy.png";
import CoachDempseyToteBlue from "../assets/Coach_Dempsey_Tote_22_In_Signature_Jacquard_With_Stripe_And_Coach_Patch_With_OG_Box_&_Dust_Bag_(Blue-5638)) - Copy (2).png";
import CoachDempseyTotePink from "../assets/Coach_Dempsey_Tote_22_In_Signature_Jacquard_With_Stripe_And_Coach_Patch_With_OG_Box_&_Dust_Bag_(Pink-5638) - Copy.png";

const cleanName = (name) => {
  const brandRegex =
    /nike|adidas|gucci|louis|vuitton|adida s|ysl|hublo t|nik e|niikee|addidas|pum a|tiger mexico|hoka cielo|fossi l|rad o|jaguar|adidaas|pacific|valentino donna|jean paul|lv|puma|nikke|reebok|zara|armani|balenciaga|dior|versace|prada|fossil|rolex|casio|seiko|hublot|tissot|burberry|coach|michael kors|new balance|onitsuka|skechers|asics|timberland|under armour|jordan|yeezy|travis scott|loewe|ralph lauren|lacoste|tag heuer/gi;

  // Clean text
  let cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove junk chars
    .replace(/\s+/g, " ")
    .trim();

  // Remove brands
  cleaned = cleaned.replace(brandRegex, "").trim();

  // Add premium words randomly
  const prefixes = ["Premium", "Luxury", "Exotic"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  return `${randomPrefix} ${cleaned}`
    .replace(/\s+/g, " ")
    .trim();
};

const products = [
  { name: "Jean Paul Gaultier JPG Le Male Collector Edition 125ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc24b580bfc0.jpeg", price: 1200, category: "Jeans & Trouser & Trackpant" },
  { name: "Valentino_Donna_The_Gold_EDP_100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc22f3d473e0.jpeg", price: 1198, category: "Other" },
  { name: "Parfums de Marly Le Rosee Royal Essence 75ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc2258b97c83.jpeg", price: 1198, category: "Perfumes" },
  { name: "Louis_Vuitton_Pacific_Chill_EDP_100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc213d0158f0.jpeg", price: 1199, category: "Other" },
  { name: "Parfums de Marly Kalan 125ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc20ba3bbb00.jpeg", price: 1198, category: "Perfumes" },
  { name: "Onitsuka TIGER Mexico 66 YELLOW BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68dc206b0a79b0.jpg", price: 2799, category: "Other" },
  { name: "Jaguar Classic Electric Sky EDT 100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc200bbdbe90.jpeg", price: 1198, category: "Perfumes" },
  { name: "WMN Adidaass Samba White For Her With Kechain", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1f9a9a2340.jpeg", price: 2599, category: "Other" },
  { name: "Adidaass Samba White Mens With Kechain", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1f3c703d30.jpeg", price: 2599, category: "Other" },
  { name: "_Burberry_Touch_EDP_100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1f1d36d080.jpeg", price: 1198, category: "Other" },
  { name: "Viktor & Rolf Flowerbomb EDP 100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1e43003870.jpeg", price: 1198, category: "Other" },
  { name: "palermo white black", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1e20eabb70.jpg", price: 3199, category: "Other" },
  { name: "_Gucci_The_Voice_of_Snake_EDP_100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1d90c2e3a0.jpeg", price: 1198, category: "Other" },
  { name: "Parfums de Marly Darcy EDP 75ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1d04178ab0.jpeg", price: 1198, category: "Perfumes" },
  { name: "Dunhill Desire Red EDT 100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dc1bad22ef00.jpeg", price: 12599, category: "Perfumes" },
  { name: "Conversee Chuck 70 Taylor Low Top Green Envy 281", image: "https://cdn.cartpe.in/images/gallery_sm/68dc17d3525ed.jpeg", price: 3200, category: "Other" },
  { name: "E sb dunk low ae 86", image: "https://cdn.cartpe.in/images/gallery_sm/68dc12f3130930.jpg", price: 3199, category: "Other" },
  { name: "Nikkee AirForce 1 Low 07 Black Suede Gum", image: "https://cdn.cartpe.in/images/gallery_sm/68dc0d7d57f2a0.jpg", price: 3299, category: "Other" },
  { name: "Hoka Cielo X1 2 0 Black White", image: "https://cdn.cartpe.in/images/gallery_sm/68dc0af6531c40.jpg", price: 3799, category: "Other" },
  { name: "Boss Premium Quality Travel duffle bag with strap", image: "https://cdn.cartpe.in/images/gallery_sm/68dc0a5f1b3b73.jpg", price: 3999, category: "HandBags and Bag" },
  { name: "Boss Premium Quality Travel duffle bag with strap", image: "https://cdn.cartpe.in/images/gallery_sm/68dc0a5f1b3b73.jpg", price: 3999, category: "HandBags and Bag" },
  { name: "Lacostee. Audyssor Trail", image: "https://cdn.cartpe.in/images/gallery_sm/68dc08f4ef728.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "MICHAEL_KORS JET SET TRAVEL CROSSBODY BAG WITH OG BOX AND DUST BAG WITH CARRY BAG PREMIUM QUALITY (BROWN) M7021", image: "https://cdn.cartpe.in/images/gallery_sm/68dc080e632b10.jpg", price: 3299, category: "HandBags and Bag" },
  { name: "Lacostee Audyssor Trail Black White", image: "https://cdn.cartpe.in/images/gallery_sm/68dc07df0c3b3.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "Newbalance 9060 turtledove womens", image: "https://cdn.cartpe.in/images/gallery_sm/68dc06f69bfce0.jpeg", price: 3799, category: "Other" },
  { name: "MICHAEL_KORS JET SET TRAVEL CROSSBODY BAG WITH OG BOX AND DUST BAG WITH CARRY BAG PREMIUM QUALITY (PINK) M7021", image: "https://cdn.cartpe.in/images/gallery_sm/68dc06a130cb00.jpg", price: 3299, category: "HandBags and Bag" },
  { name: "Air force 1 vachetta Tan", image: "https://cdn.cartpe.in/images/gallery_sm/68dc060fdc9993.jpg", price: 3200, category: "Other" },
  { name: "Adidass Samba OG Maroon", image: "https://cdn.cartpe.in/images/gallery_sm/68dc05fec3d59.jpeg", price: 3000, category: "Other" },
  { name: "GUCC_I LUXURY SIDE BAG WITH DUST BAG HEAVY QUALITY (GREY) 8011G", image: "https://cdn.cartpe.in/images/gallery_sm/68dc05bf754d80.jpg", price: 2499, category: "HandBags and Bag" },
  { name: "airforce 1 07 desert khaki", image: "https://cdn.cartpe.in/images/gallery_sm/68dc05ba0da320.jpg", price: 3299, category: "Other" },
  { name: "Airforcee 1 Low 07 Reflective Swoosh Cool Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68dc056f6cdf20.jpg", price: 3300, category: "Other" },
  { name: "Nikee AirMax 95 X OG Levis Obsidian Denim", image: "https://cdn.cartpe.in/images/gallery_sm/68dc0508ba3b4.jpeg", price: 3600, category: "Other" },
  { name: "GUCC_I LUXURY SIDE BAG WITH DUST BAG HEAVY QUALITY (BROWN) 8011G", image: "https://cdn.cartpe.in/images/gallery_sm/68dc04f41c5b10.jpg", price: 2499, category: "HandBags and Bag" },
  { name: "VERSACE GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/68dc049dd94510.jpg", price: 1100, category: "Other" },
  { name: "SEIKO 5 sports WATCH black 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dc043a63bc20.jpeg", price: 1949, category: "Luxury Watch" },
  { name: "Yeez y 350 Tail light for men semi ua with full kit", image: "https://cdn.cartpe.in/images/gallery_sm/68dc03f08f0442.jpg", price: 3200, category: "Other" },
  { name: "Levis x Nikee Air Max 95 OG Black Anthracite", image: "https://cdn.cartpe.in/images/gallery_sm/68dc03600a31a.jpeg", price: 3600, category: "Other" },
  { name: "Yeez y 350 Bone white for men semi ua with full kit", image: "https://cdn.cartpe.in/images/gallery_sm/68dc02ebc14e50.jpg", price: 3200, category: "Other" },
  { name: "Nikee AirMax 95 OG x Levis Light Orewood Brown", image: "https://cdn.cartpe.in/images/gallery_sm/68dc02e7664c7.jpeg", price: 3600, category: "Other" },
  { name: "New_Balance 9060 white navy", image: "https://cdn.cartpe.in/images/gallery_sm/68dc02cb68f490.jpg", price: 3499, category: "Other" },
  { name: "On Cloud X4 Pearl Ivory Year of the Snake", image: "https://cdn.cartpe.in/images/gallery_sm/68dc02963d69d.jpeg", price: 3800, category: "Other" },
  { name: "SEIKO  WATCH Blue 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbff992cdbd0.jpg", price: 1850, category: "Luxury Watch" },
  { name: "SEIKO 5  WATCH Green 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbff533e16f0.jpg", price: 1850, category: "Luxury Watch" },
  { name: "Onitsuk_aa Tiger Maxico 66 Iron Navy 211", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfe91a78840.jpg", price: 2800, category: "Other" },
  { name: "Gucci_Mini_Gg_Canvas_Bag_With_Double_Og_Box_And_Dust_Bag_Including_CarryBag", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfe0e72aa80.jpg", price: 3800, category: "Shoes" },
  { name: "Versac e Designer All Brown Logo Luxury Shade 6621", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfdd33eaf20.jpeg", price: 1149, category: "Other" },
  { name: "Onitsuk_aa Tiger Maxico 66 Cream Black Gold 149", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfda06650b0.jpg", price: 2800, category: "Other" },
  { name: "GUCC_I ATTACHE LEATHER LARGE SHOULDER BAG WITH BOX AND DUST BAG (BLACK) (S18)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfc6ed455e0.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Omeg a Moon", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfbf3b36970.jpeg", price: 1850, category: "Other" },
  { name: "Omeg a Moon", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfbcbec07c0.jpeg", price: 1850, category: "Other" },
  { name: "Adidaass samba white green", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfbbfec4d60.jpg", price: 2599, category: "Other" },
  { name: "GUCC_I ATTACHE LEATHER LARGE SHOULDER BAG WITH BOX AND DUST BAG (APRICOT) (S18)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfb9e444e40.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "BUMBER CAR 2 PCS SET PREMIUM WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfb85bc52f2.jpeg", price: 2600, category: "Other" },
  { name: "Fossi l Automatic", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfb214bc490.jpg", price: 2050, category: "Luxury Watch" },
  { name: "Fossi l Automatic", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfb09be26c0.jpg", price: 2050, category: "Luxury Watch" },
  { name: "BURBERRY_TB_SHINY_LOGO_LEATHER_BAG_BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfaf982cfa0.jpg", price: 2999, category: "HandBags and Bag" },
  { name: "Rad_o chronometer 100m - J1743", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfa41f29af0.jpg", price: 1899, category: "Other" },
  { name: "Rad_o chronometer 100m - J1742", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfa1da6dd40.jpg", price: 1899, category: "Other" },
  { name: "Rad_o chronometer 100m - J1741", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfa058bada0.jpg", price: 1899, category: "Other" },
  { name: "BURBERRY_TB_GRAINED_LEATHER_BAG_BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbfa0170e570.jpg", price: 2999, category: "HandBags and Bag" },
  { name: "Rad_o chronometer 100m - J1740", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf9dfdac960.jpg", price: 1899, category: "Other" },
  { name: "Rad_o chronometer 100m - J1739", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf9c6e79150.jpg", price: 1899, category: "Other" },
  { name: "Tag Hue r CR7", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf9bf4dbe30.jpg", price: 2000, category: "Other" },
  { name: "Tag Hue r CR7", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf9a13b8f70.jpg", price: 2000, category: "Other" },
  { name: "Tag Hue r CR7", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf97b2a7250.jpg", price: 2000, category: "Other" },
  { name: "Tag Hue r CR7", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf934a780c0.jpg", price: 2000, category: "Other" },
  { name: "Tag Hue r CR7", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf91abb6490.jpg", price: 2000, category: "Other" },
  { name: "Balmai.n Unicorn Paris Multi", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf8babd4c70.jpeg", price: 5999, category: "Other" },
  { name: "Casio Edifice Ex295 World Map", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf780e52cc0.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Ex295 World Map", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf71647f270.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Ex295 World Map", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf6cb1c9f10.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Ex295 World Map", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf69fc04fe0.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Ex295 World Map Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf68abfac60.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Ex295 World Map", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf674944de0.jpg", price: 1899, category: "Other" },
  { name: "Casio Edifice Efr 540D", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf622985190.jpg", price: 1799, category: "Other" },
  { name: "Casio Edifice Efr 540D", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf60b1825e0.jpg", price: 1799, category: "Other" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf4e9159a20.jpg", price: 1599, category: "Other" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf4c0c779b0.jpg", price: 1599, category: "Other" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf49cf31d60.jpg", price: 1599, category: "Other" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf47ac73ed0.jpg", price: 1599, category: "Other" },
  { name: "Coach_Signature_Canvas_Shoulder_Bag_Tote_With_CarryBag_(Yellow)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf4799bc260.jpg", price: 3799, category: "Shoes" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf460afad70.jpg", price: 1599, category: "Other" },
  { name: "Coach_Signature_Canvas_Shoulder_Bag_Tote_With_CarryBag_(Pink)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf45aa2dce0.jpg", price: 3799, category: "Shoes" },
  { name: "Casio Edifice Efr539", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf43b913640.jpg", price: 1599, category: "Other" },
  { name: "Coach_Signature_Canvas_Shoulder_Bag_Tote_With_CarryBag_(Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf4344bc8f0.jpg", price: 3800, category: "Shoes" },
  { name: "Adida_ss samba maroon gold", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf3adba6ff0.jpg", price: 3000, category: "Other" },
  { name: "LOUIS_VUITTON MINI PREMIUM ONTHEGO WITH COIN POUCH AND DOUBLE BOX INCLUDING CARRY BAG", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf32cdf4830.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Adida_ss Samba Strata Beige", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf27ebcc200.jpg", price: 2800, category: "Other" },
  { name: "Coach_Satchel_Women_Crossbody_Bag_Sling_Bag_With_Box_And_DustBag_(White)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf24fd082a0.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "ON Cloud Hi-Edge Light Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf24fd5bb3.jpeg", price: 4000, category: "Other" },
  { name: "Coach_Satchel_Women_Crossbody_Bag_Sling_Bag_With_Box_And_DustBag_(Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf235100f50.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "ON CLOUD HI EDGE Black grey", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf1a27d91c.jpeg", price: 4000, category: "Other" },
  { name: "Asic_ss Gel Nimbus 26 white black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf0f8969880.jpg", price: 3500, category: "Other" },
  { name: "Asic_ss Gel kayano 30 Navy Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68dbf0647470d2.jpg", price: 3700, category: "Other" },
  { name: "Cartier_482_black_plano", image: "https://cdn.cartpe.in/images/gallery_sm/68dbef609269d0.jpeg", price: 1100, category: "Luxury Watch" },
  { name: "Jorda_nn 1 Hyper Royal semi ua with extra lace", image: "https://cdn.cartpe.in/images/gallery_sm/68dbef6c8a5b70.jpg", price: 3200, category: "Other" },
  { name: "jorda_nn 1 Unc Toe SEMI UA with extra lace", image: "https://cdn.cartpe.in/images/gallery_sm/68dbee9d52e2e0.jpg", price: 3200, category: "Other" },
  { name: "Jorda_nn retro 4 pine green semi ua with same box butter paper", image: "https://cdn.cartpe.in/images/gallery_sm/68dbed661d53a0.jpg", price: 3500, category: "Other" },
  { name: "Jorda_nn Retro 4 Black Cat semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/68dbec6fca0540.jpg", price: 3600, category: "Other" },
  { name: "Onitsuk_aa tiger moage cream black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbeb8b313c70.jpg", price: 3800, category: "Other" },
  { name: "sb dunk low pro j pack shadow black Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68dbeae6de4290.jpg", price: 3200, category: "Other" },
  { name: "sb dunk low medium curry", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe8ee87ddd0.jpg", price: 3200, category: "Other" },
  { name: "Onitsuk_aa Tiger Slip On Navy Blue Beige", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe8198eea40.jpg", price: 2800, category: "Other" },
  { name: "Adida s Back Printed White Premium Round Neck T-shirt F2386-WH", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe8f1f054c1.jpeg", price: 1649, category: "Shirts & Tshirt" },
  { name: "Burberry_2821_Black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe7fe467d20.jpeg", price: 1100, category: "Other" },
  { name: "Adida s Back Printed Black Premium Round Neck T-shirt F2386-BL", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe892361924.jpeg", price: 1649, category: "Shirts & Tshirt" },
  { name: "Hublo_t Bigbang Tourbillion - J1738", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe7c3811560.jpg", price: 1549, category: "Other" },
  { name: "Hublo_t Bigbang Tourbillion - J1737", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe7a1e0d310.jpg", price: 1549, category: "Other" },
  { name: "Ysl belt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe787c361f0.jpg", price: 1300, category: "Other" },
  { name: "Hublo_t Bigbang Tourbillion - J1736", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe785bfef40.jpg", price: 1549, category: "Other" },
  { name: "Onitsuk_aa tiger Mexico 66 black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe6180f6b92.jpg", price: 2800, category: "Other" },
  { name: "On Running CloudMonster Frost Wash 280", image: "https://cdn.cartpe.in/images/gallery_sm/68dbe00723292.jpeg", price: 3800, category: "Shoes" },
  { name: "On Running Cloud X 3 lvory 279", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdf92d3208.jpeg", price: 3800, category: "Shoes" },
  { name: "Crcs Literide 360 Clogs Multi Sole", image: "https://cdn.cartpe.in/images/gallery_sm/68d7f1671b81b.jpeg", price: 1900, category: "Other" },
  { name: "NIK.E AIRMAX 1 BROWN", image: "https://cdn.cartpe.in/images/gallery_sm/68d6b44229c83.jpeg", price: 1899, category: "Other" },
  { name: "NIK.E AIRMAX 1 BLACK WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68d6b3b591724.jpeg", price: 1899, category: "Other" },
  { name: "NIK.E AIRMAX 1 SLIDE GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/68d6b37b91b40.jpeg", price: 1899, category: "Other" },
  { name: "NIK.E AIRMAX 1 WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68d6b352b094e.jpeg", price: 1899, category: "Other" },
  { name: "Air jordan retro 1 low paris", image: "https://cdn.cartpe.in/images/gallery_sm/68d54981d2913.jpeg", price: 3200, category: "Other" },
  { name: "LOUIS VUITTTON MIAMI MULE WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68d525a71c601.jpeg", price: 1800, category: "Other" },
  { name: "LOUIS VUITTTON MIAMI MULE BROWN", image: "https://cdn.cartpe.in/images/gallery_sm/68d5257b29365.jpeg", price: 1800, category: "Other" },
  { name: "LOUIS VUITTTON MIAMI MULE", image: "https://cdn.cartpe.in/images/gallery_sm/68d5254692c84.jpeg", price: 1800, category: "Other" },
  { name: "ADDIDAS SAMBA WHITE SAND", image: "https://cdn.cartpe.in/images/gallery_sm/68d2abba57c0b.jpeg", price: 3200, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 REVERSE KILL BILL", image: "https://cdn.cartpe.in/images/gallery_sm/68d2aa65709a7.jpeg", price: 2800, category: "Other" },
  { name: "ONITSUKA TIGER SLIP ON WHITE NAVY", image: "https://cdn.cartpe.in/images/gallery_sm/68d2a9e01fcbe.jpeg", price: 2800, category: "Other" },
  { name: "ADDIDAS ADIZERO ADIOS PRO 9 WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68d2a625600e8.jpeg", price: 3600, category: "Other" },
  { name: "ADDIDAS ADIZERO ADIOS PRO 9 BLACK WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68d2a57f02c71.jpeg", price: 3600, category: "Other" },
  { name: "ONITSUKA TIGER BEIGE OLIVE", image: "https://cdn.cartpe.in/images/gallery_sm/68ceb15acef330.jpeg", price: 2800, category: "Other" },
  { name: "NEW BALLANCE 9060 RAIN CLOUD", image: "https://cdn.cartpe.in/images/gallery_sm/68c42d4224606.jpeg", price: 3500, category: "Other" },
  { name: "Air Jordan Retro 1 Unc Reimagined", image: "https://cdn.cartpe.in/images/gallery_sm/68c18334ee9ea.jpeg", price: 3500, category: "Other" },
  { name: "ON RUNNING CLOUD TEMPEST HORIZON", image: "https://cdn.cartpe.in/images/gallery_sm/68c031a609cd60.jpeg", price: 3500, category: "Shoes" },
  { name: "ADDIDAS SAMBA WONDER", image: "https://cdn.cartpe.in/images/gallery_sm/68baa25b27dae0.jpeg", price: 3200, category: "Other" },
  { name: "Adi das adizero evo sl Carbon Lucid Red black", image: "https://cdn.cartpe.in/images/gallery_sm/68b6de96e32d00.jpg", price: 3600, category: "Other" },
  { name: "adida adizero evo sl white black", image: "https://cdn.cartpe.in/images/gallery_sm/68b6dae366cdd0.jpeg", price: 3600, category: "Other" },
  { name: "Adi das adizero evo sl black", image: "https://cdn.cartpe.in/images/gallery_sm/68b6da193e99a1.jpeg", price: 3600, category: "Other" },
  { name: "On running Cloudsurfer Orange", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d914770690.png", price: 3500, category: "Shoes" },
  { name: "On running Cloudsurfer GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d86e3677b0.jpg", price: 3500, category: "Shoes" },
  { name: "SKECHER aero burst sneakers BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d4a6658f41.png", price: 3700, category: "Shoes" },
  { name: "SKECHER aero burst sneakers navy", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d45b012150.jpg", price: 3700, category: "Shoes" },
  { name: "SKECHER aero burst sneakers GREY", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d3d86174b5.jpg", price: 3700, category: "Shoes" },
  { name: "SKECHER aero burst sneakers WHITE NEON", image: "https://cdn.cartpe.in/images/gallery_sm/68b6d0f393c940.jpg", price: 3700, category: "Shoes" },
  { name: "onitsuka Tiger Mexico 66 Black Classcic red", image: "https://cdn.cartpe.in/images/gallery_sm/689214126be2c.jpeg", price: 2800, category: "Other" },
  { name: "NEEW BALANCE 9060 black white", image: "https://cdn.cartpe.in/images/gallery_sm/688e2da2e8af6.jpeg", price: 3500, category: "Other" },
  { name: "NIK E ZOOM X SMILEY BLACK WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/688e2ccb57e60.jpeg", price: 3200, category: "Other" },
  { name: "NEW BALANCE FUELL CELL ELITE V4 GREY WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/688e2c68ed388.jpeg", price: 3200, category: "Other" },
  { name: "NBfuell cell elite v4 white", image: "https://cdn.cartpe.in/images/gallery_sm/688e2c1b34b0c.jpeg", price: 3200, category: "Other" },
  { name: "NEWW BALANCE fuell cell elite v4 white navy", image: "https://cdn.cartpe.in/images/gallery_sm/688e2b90c2ec0.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 MOCHA", image: "https://cdn.cartpe.in/images/gallery_sm/6868f18896c5c.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 SPIDERMAN", image: "https://cdn.cartpe.in/images/gallery_sm/682c3c2ed702e.jpeg", price: 3200, category: "Other" },
  { name: "Air Jordan Retro 1 X Travis Scott Olive Green Semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/682c3a2b42962.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 Travis scott PHANTOM", image: "https://cdn.cartpe.in/images/gallery_sm/681a203e69548.jpeg", price: 3500, category: "Other" },
  { name: "Air Jordan RETRO 1 X TRAVIS SCOTT FRAGMENT SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/68077189050ab.jpeg", price: 3200, category: "Other" },
  { name: "A fast rb nitro elite green sale", image: "https://cdn.cartpe.in/images/gallery_sm/67c593f469dda.jpeg", price: 3500, category: "Other" },
  { name: "Pum_a Nitro Fast Rb elite Orange Sale", image: "https://cdn.cartpe.in/images/gallery_sm/67b35c05c6454.jpeg", price: 3500, category: "Other" },
  { name: "Pum_a Nitro Fast rb Elite Blue Sale", image: "https://cdn.cartpe.in/images/gallery_sm/67b35b58bc8e6.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 travis scott LOW REVERSE MOCHA", image: "https://cdn.cartpe.in/images/gallery_sm/678b9c0c131bc.jpeg", price: 3200, category: "Other" },
  { name: "NIK E AIR JORDAN RETRO 1 LOST N FOUND SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/678b9648c68ec.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 LOW OG X ZION WILLIAMSON", image: "https://cdn.cartpe.in/images/gallery_sm/676aa824cc049.jpeg", price: 3200, category: "Other" },
  { name: "NIK E SB DUNK LOW JARRITOS", image: "https://cdn.cartpe.in/images/gallery_sm/673c501ca94d5.jpeg", price: 3200, category: "Other" },
  { name: "E air jordan retro 1 high university blue", image: "https://cdn.cartpe.in/images/gallery_sm/673335128df4f.jpeg", price: 3200, category: "Other" },
  { name: "niikE airforce 1 full black mid sale", image: "https://cdn.cartpe.in/images/gallery_sm/6705011a38f85.jpeg", price: 2500, category: "Other" },
  { name: "air zoom pegasus 41 volt Sale", image: "https://cdn.cartpe.in/images/gallery_sm/66d18a92e1ebf.jpeg", price: 2500, category: "Other" },
  { name: "NIKEE AIRMAX DN OLDER KIDS GREY SALE", image: "https://cdn.cartpe.in/images/gallery_sm/66bb50b1bdc96.jpeg", price: 2500, category: "Other" },
  { name: "NIK.E AIRFORCE 1 WHITE PREMIUM LEATHER QUALITY", image: "https://cdn.cartpe.in/images/gallery_sm/668e7c990f166.jpeg", price: 2500, category: "Other" },
  { name: "AMIIRI . ma1 snekar sale", image: "https://cdn.cartpe.in/images/gallery_sm/666039de958b3.jpeg", price: 2500, category: "Other" },
  { name: "NIIKEE airmax plus blue fix rate", image: "https://cdn.cartpe.in/images/gallery_sm/665f313f8272f.jpeg", price: 2500, category: "Other" },
  { name: "nikeee airmax plus white", image: "https://cdn.cartpe.in/images/gallery_sm/6620caa22b81a.jpeg", price: 2500, category: "Other" },
  { name: "air jordan retro 1 x travis scott fragment Sale", image: "https://cdn.cartpe.in/images/gallery_sm/68b03904b1a27.jpeg", price: 2500, category: "Other" },
  { name: "Skecher_s Go run Max Road Neon Sale", image: "https://cdn.cartpe.in/images/gallery_sm/68ad9a09c13bc.jpeg", price: 3000, category: "Other" },
  { name: "AIR JORDAN RETRO 1 ELEPHANT PRINT sale", image: "https://cdn.cartpe.in/images/gallery_sm/68ac6ffab5da2.jpeg", price: 2500, category: "Other" },
  { name: "AIR JORDAN RETRO 4 LEVIS", image: "https://cdn.cartpe.in/images/gallery_sm/68971794d1772.jpeg", price: 3500, category: "Other" },
  { name: "ONITSUKA TIGER SLIP ON WHITE BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/6896edf68442b.jpeg", price: 2800, category: "Other" },
  { name: "ONITSUKA TIGER SLIP ON WHITE BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/6896ecaa79de4.jpeg", price: 2800, category: "Other" },
  { name: "NIK E SB DUNK LOW WHITE CLEAR EMERALD SALE", image: "https://cdn.cartpe.in/images/gallery_sm/6880955d2ea75.jpeg", price: 3000, category: "Other" },
  { name: "NIK E AIRFORCE 1 BLACK PREMIUM LEATHER", image: "https://cdn.cartpe.in/images/gallery_sm/687a2ad7cdc06.jpeg", price: 2399, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 BLACK WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/686ba9cec0a11.jpeg", price: 2800, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Beige Green", image: "https://cdn.cartpe.in/images/gallery_sm/686fa20e6f3af.jpeg", price: 2800, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Yellow", image: "https://cdn.cartpe.in/images/gallery_sm/686f8aa77755b.jpeg", price: 2800, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 All Black", image: "https://cdn.cartpe.in/images/gallery_sm/686fa35acc331.jpeg", price: 2800, category: "Other" },
  { name: "Onitsuka Tiger mexico 66 Safari Green", image: "https://cdn.cartpe.in/images/gallery_sm/686ba6e4e4388.jpeg", price: 2800, category: "Other" },
  { name: "ON RUNNING CLOUD BOOM WHITE MULTI", image: "https://cdn.cartpe.in/images/gallery_sm/686ba560c9975.jpeg", price: 3500, category: "Shoes" },
  { name: "On Cloud Runner 2 Undyed Green", image: "https://cdn.cartpe.in/images/gallery_sm/686ba47d4cd06.jpeg", price: 3500, category: "Other" },
  { name: "Air jordan retro 1 x travis scott fragment heat", image: "https://cdn.cartpe.in/images/gallery_sm/686ba401e0897.jpeg", price: 3200, category: "Other" },
  { name: "Air Jordan Retro 1 X travis scott Medium Olive", image: "https://cdn.cartpe.in/images/gallery_sm/686ba3a189399.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 4 MID NIGHT NAVY", image: "https://cdn.cartpe.in/images/gallery_sm/686ba1f061992.jpeg", price: 3500, category: "Other" },
  { name: "ADDIDAS YEEZY 350 BOOST V2 MX DARK SALT", image: "https://cdn.cartpe.in/images/gallery_sm/686b9fede399f.jpeg", price: 3000, category: "Other" },
  { name: "AIR JORDAN RETRO 3 RARE AIR", image: "https://cdn.cartpe.in/images/gallery_sm/686b9f0f39c34.jpeg", price: 3500, category: "Other" },
  { name: "NIKKEE sb dunk low toyota ae86", image: "https://cdn.cartpe.in/images/gallery_sm/68690bde5372f.jpeg", price: 3200, category: "Other" },
  { name: "Airforce 07 Low Hamava", image: "https://cdn.cartpe.in/images/gallery_sm/685d0afe0c235.jpeg", price: 2700, category: "Other" },
  { name: "Onitsuka Tiger Sabot Slip On Black White", image: "https://cdn.cartpe.in/images/gallery_sm/685a7f0263ac1.jpeg", price: 3200, category: "Other" },
  { name: "Air Jordan Retro 4 Brick By Brick Semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/685a75c79abee.jpeg", price: 3500, category: "Other" },
  { name: "Pu..m a Club Era Black White", image: "https://cdn.cartpe.in/images/gallery_sm/685550727be45.jpeg", price: 3200, category: "Other" },
  { name: "trainer black white", image: "https://cdn.cartpe.in/images/gallery_sm/6853afd35c75e.jpeg", price: 3200, category: "Other" },
  { name: "ADDIDAS SAMBA WHITE FOR MEN AND WOMEN", image: "https://cdn.cartpe.in/images/gallery_sm/6853aaf55ea7b.jpeg", price: 2499, category: "Other" },
  { name: "Addidas x kasina samba consortium cup  sale", image: "https://cdn.cartpe.in/images/gallery_sm/684d9153ecb12.jpeg", price: 2600, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 WHITE ORANGE", image: "https://cdn.cartpe.in/images/gallery_sm/684a78fb06959.jpeg", price: 2800, category: "Other" },
  { name: "NIIKEE sb dunk low x NORTH FACE", image: "https://cdn.cartpe.in/images/gallery_sm/68485069a356b.jpeg", price: 3200, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 beige cream", image: "https://cdn.cartpe.in/images/gallery_sm/68484fb4aef89.jpeg", price: 2800, category: "Other" },
  { name: "Onitsuka Tiger Sclaw Navy Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68484e6db8966.jpeg", price: 3500, category: "Other" },
  { name: "Nikee Airforce 1 Low Beige Reflective", image: "https://cdn.cartpe.in/images/gallery_sm/68484e58c6b1b.jpeg", price: 3200, category: "Other" },
  { name: "Onitsuka Tiger Sclaw Black", image: "https://cdn.cartpe.in/images/gallery_sm/68484e456b971.jpeg", price: 3500, category: "Other" },
  { name: "Air Jordan retro 1 x travis scott Jumpman Jack Red swoosh", image: "https://cdn.cartpe.in/images/gallery_sm/68484de0be149.jpeg", price: 3500, category: "Other" },
  { name: "ON Cloudsurfer Next Glacier White", image: "https://cdn.cartpe.in/images/gallery_sm/68484b0b5ef84.jpeg", price: 3500, category: "Other" },
  { name: "Air jordan Retro 4 X levis Denim", image: "https://cdn.cartpe.in/images/gallery_sm/68484a09a7f8c.jpeg", price: 3500, category: "Other" },
  { name: "On Running Cloudtec Full Black", image: "https://cdn.cartpe.in/images/gallery_sm/6848489d722f5.jpeg", price: 3500, category: "Shoes" },
  { name: "on running cloud x LOEWE OCEAN BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/684818c528257.jpeg", price: 3500, category: "Shoes" },
  { name: "On Running Cloud Surfer Black White", image: "https://cdn.cartpe.in/images/gallery_sm/6847e1eb4d848.jpeg", price: 3500, category: "Shoes" },
  { name: "on Running Cloud Runner Olivegreen mohagany", image: "https://cdn.cartpe.in/images/gallery_sm/6842ddbfc6acd.jpeg", price: 3500, category: "Shoes" },
  { name: "NIIKEE sb dunk low steam puppet year of the dragon", image: "https://cdn.cartpe.in/images/gallery_sm/682c414d47623.jpeg", price: 3200, category: "Other" },
  { name: "Adiddass Ultraboost Light neon Running", image: "https://cdn.cartpe.in/images/gallery_sm/682c4086bcdaa.jpeg", price: 3200, category: "Shoes" },
  { name: "Addidass Samba x Wales bonner Navy Croc", image: "https://cdn.cartpe.in/images/gallery_sm/682c3f1ad07b7.jpeg", price: 3500, category: "Other" },
  { name: "New Balance 550 White Grey", image: "https://cdn.cartpe.in/images/gallery_sm/682c3de0636d1.jpeg", price: 3000, category: "Other" },
  { name: "NEW BALANNCE 550 black rain cloud", image: "https://cdn.cartpe.in/images/gallery_sm/682c3d19997df.jpeg", price: 3000, category: "Other" },
  { name: "N IKE AIRFORCE 1 UNDEFEATED", image: "https://cdn.cartpe.in/images/gallery_sm/682c3d0fc1d5b.jpeg", price: 3300, category: "Other" },
  { name: "Adiddass Samba Og Made in Italy Black Core", image: "https://cdn.cartpe.in/images/gallery_sm/682c3bfa3a3ad.jpeg", price: 3200, category: "Other" },
  { name: "NEWW BALANCE 327 white brown", image: "https://cdn.cartpe.in/images/gallery_sm/682c3b8d65ce4.jpeg", price: 3200, category: "Other" },
  { name: "Timberland x  wheat bootS", image: "https://cdn.cartpe.in/images/gallery_sm/682e35cd1a0c6.jpeg", price: 5500, category: "Shoes" },
  { name: "On Running Cloudnova 5 White Pearl", image: "https://cdn.cartpe.in/images/gallery_sm/682c38c4812ef.jpeg", price: 3700, category: "Shoes" },
  { name: "AIR JORDAN RETRO 1 TURBO GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/682c38be36667.jpeg", price: 3500, category: "Other" },
  { name: "On Running Cloudnova 5 White sand", image: "https://cdn.cartpe.in/images/gallery_sm/682c388ecc904.jpeg", price: 3700, category: "Shoes" },
  { name: "On Running Cloudtilt Running Iron Dew", image: "https://cdn.cartpe.in/images/gallery_sm/682c3722a008f.jpeg", price: 3700, category: "Shoes" },
  { name: "AIR JORDAN RETRO 1 METALLIC  cOURT PURPLE", image: "https://cdn.cartpe.in/images/gallery_sm/682c362f1e92a.jpeg", price: 3200, category: "Other" },
  { name: "On Running Cloud X3 Training Black", image: "https://cdn.cartpe.in/images/gallery_sm/682c360a1b37a.jpeg", price: 3700, category: "Shoes" },
  { name: "On Running Cloud x 4 Training White", image: "https://cdn.cartpe.in/images/gallery_sm/682c35270372d.jpeg", price: 3700, category: "Shoes" },
  { name: "ALEXANDER MCQUEEN PREMIUM SNEAKERS", image: "https://cdn.cartpe.in/images/gallery_sm/682c32009567d.jpeg", price: 4000, category: "Shoes" },
  { name: "Air Jordan Retro 1 X Travis Scott Canary SEMI ua", image: "https://cdn.cartpe.in/images/gallery_sm/682c3130a12fe.jpeg", price: 3200, category: "Other" },
  { name: "ADDIDAS ULTRA BOOST LIGHT RUNNING", image: "https://cdn.cartpe.in/images/gallery_sm/682c305037e67.jpeg", price: 3500, category: "Shoes" },
  { name: "UNDER ARMAR phantom 4", image: "https://cdn.cartpe.in/images/gallery_sm/6821a60ccfc05.jpeg", price: 3500, category: "Other" },
  { name: "ONITSUKA TIGER PRANK PANDA Sale", image: "https://cdn.cartpe.in/images/gallery_sm/681b2ddc4e845.jpeg", price: 3000, category: "Other" },
  { name: "HOKA BONDI GREY WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/681a2e505d635.jpeg", price: 3500, category: "Other" },
  { name: "HOKA BONDI BLUE WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/681a2e144a4b6.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 UNION LA RED", image: "https://cdn.cartpe.in/images/gallery_sm/68a703de86ff6.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 TRAVIS SCOOT VELVET BROWN", image: "https://cdn.cartpe.in/images/gallery_sm/681a28416ac7a.jpeg", price: 3500, category: "Other" },
  { name: "UNDER ARRMOUR hover phantom 4", image: "https://cdn.cartpe.in/images/gallery_sm/681a23ba48307.jpeg", price: 3500, category: "Other" },
  { name: "PUM.AA palermo black white", image: "https://cdn.cartpe.in/images/gallery_sm/681a20ceadfbb.jpeg", price: 3200, category: "Other" },
  { name: "N IKE AIRFORCE 07 x TIFFANY N CO SEMI UA PACKING", image: "https://cdn.cartpe.in/images/gallery_sm/681a1eafc975d.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 4 PINE GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/681a1e41e73f3.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 4 MILITARY BLACK SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/681a1df680592.jpeg", price: 3500, category: "Other" },
  { name: "AIR JORDAN RETRO 4 BLACK CAT", image: "https://cdn.cartpe.in/images/gallery_sm/681a1dc9802c1.jpeg", price: 3500, category: "Other" },
  { name: "ADDIDAS ULTRA BOOST ARGENTINA", image: "https://cdn.cartpe.in/images/gallery_sm/681a1c7a93a87.jpeg", price: 3200, category: "Other" },
  { name: "LOUISS VUITTON  trainer all black", image: "https://cdn.cartpe.in/images/gallery_sm/681a1baceffa4.jpeg", price: 3200, category: "Other" },
  { name: "N IKE AIRFORCE LV BROWN", image: "https://cdn.cartpe.in/images/gallery_sm/681a1b4d67453.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 TRAVIS SCOTT X JUMPMAN JACK", image: "https://cdn.cartpe.in/images/gallery_sm/681a1adc714dd.jpeg", price: 4000, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 WHITE VINTEN", image: "https://cdn.cartpe.in/images/gallery_sm/6825a8481d632.jpeg", price: 2800, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 BERRY RED", image: "https://cdn.cartpe.in/images/gallery_sm/6817443d5e134.jpeg", price: 2800, category: "Other" },
  { name: "Nikee Sb Dunk low There Skateboards", image: "https://cdn.cartpe.in/images/gallery_sm/680f987988dab.jpeg", price: 3200, category: "Other" },
  { name: "ONITSUKA Tiger Mexico 66 Brich Green Sale", image: "https://cdn.cartpe.in/images/gallery_sm/680a217ca4eb5.jpeg", price: 2500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 LOW REPAIRED DENIM", image: "https://cdn.cartpe.in/images/gallery_sm/67fcbdad310ed.jpeg", price: 3000, category: "Other" },
  { name: "Nikee Airforce 1 Cacao wow", image: "https://cdn.cartpe.in/images/gallery_sm/67fb9c8176c97.jpeg", price: 3200, category: "Other" },
  { name: "Nik air jordan retro 1  unc blue", image: "https://cdn.cartpe.in/images/gallery_sm/67fb9a146270a.jpeg", price: 3200, category: "Other" },
  { name: "nik sb dunk low cacao", image: "https://cdn.cartpe.in/images/gallery_sm/67fb9909d6bb5.jpeg", price: 2800, category: "Other" },
  { name: "LOEWEE X ON Cloudtilt 2 0 Sneakers", image: "https://cdn.cartpe.in/images/gallery_sm/67fb9841b346d.jpeg", price: 3500, category: "Shoes" },
  { name: "AIR JORDAN RETRO 1 washed black", image: "https://cdn.cartpe.in/images/gallery_sm/67fb84bc5dcea.jpeg", price: 3500, category: "Other" },
  { name: "air jordan 1 low year of the snake 2025", image: "https://cdn.cartpe.in/images/gallery_sm/67fb827d69d2d.jpeg", price: 3500, category: "Other" },
  { name: "Skecher s Go run Maxroad 6 White Sale", image: "https://cdn.cartpe.in/images/gallery_sm/67f3c27167b60.jpeg", price: 3000, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Black White", image: "https://cdn.cartpe.in/images/gallery_sm/67e12f24210fb.jpeg", price: 2800, category: "Other" },
  { name: "ON RUNNING cloud till 2 0 white HP", image: "https://cdn.cartpe.in/images/gallery_sm/67c638b505a3e.jpeg", price: 3700, category: "Shoes" },
  { name: "ON RUNNING CLOUD MONSTER CINDER FOG", image: "https://cdn.cartpe.in/images/gallery_sm/67b35eaa10614.jpeg", price: 3500, category: "Shoes" },
  { name: "Nik e Airmax 97 FUll White", image: "https://cdn.cartpe.in/images/gallery_sm/67b35d5d48748.jpeg", price: 3200, category: "Other" },
  { name: "Air jordan retro 1  chicago", image: "https://cdn.cartpe.in/images/gallery_sm/67b35a2265c2a.jpeg", price: 3200, category: "Other" },
  { name: "Nik e Air Jordan Retro 1 Royal Reimagined Semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/67b32fa2da740.jpeg", price: 3500, category: "Other" },
  { name: "Air jordan retro 4  sail semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/67b31be1ed226.jpeg", price: 3600, category: "Other" },
  { name: "9060 nori green.", image: "https://cdn.cartpe.in/images/gallery_sm/67a5e7d21d624.jpeg", price: 3500, category: "Other" },
  { name: "NIIKEE airforce 1 low coffee milk", image: "https://cdn.cartpe.in/images/gallery_sm/679a17d88379e.jpeg", price: 2800, category: "Other" },
  { name: "ADIDA S YEEZY 350 V2 Blue Tint semi ua", image: "https://cdn.cartpe.in/images/gallery_sm/679226d53eaaa.jpeg", price: 3000, category: "Other" },
  { name: "LOUIS VUITTON TRAINER BLUE DIAMOND MAXI", image: "https://cdn.cartpe.in/images/gallery_sm/678bab506787d.jpeg", price: 4800, category: "Other" },
  { name: "LOUIS VUITTON TRAINER WHITE DIAMOND MAXI", image: "https://cdn.cartpe.in/images/gallery_sm/678baab8a43ca.jpeg", price: 4800, category: "Other" },
  { name: "LOUIS VUITON  trainer black diamond maxi", image: "https://cdn.cartpe.in/images/gallery_sm/678ba9045478b.jpeg", price: 4800, category: "Other" },
  { name: "NIK E AIR JORDAN RETRO 1 LOW X TRAVIS SCOTT MOCHA SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/678b987016a8b.jpeg", price: 3200, category: "Other" },
  { name: "AIR JORDAN RETRO 1 LOW MEDIUM OLIVE", image: "https://cdn.cartpe.in/images/gallery_sm/678b97eb2c647.jpeg", price: 3200, category: "Other" },
  { name: "ADDIDAS YEEZY 350 BELUGA SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/678b96bbdd118.jpeg", price: 3000, category: "Other" },
  { name: "NIIKE SB DUNK LOW STRANGE LOVE", image: "https://cdn.cartpe.in/images/gallery_sm/678b8d5b91008.jpeg", price: 3500, category: "Other" },
  { name: "yeezy boost 350 v2 static lace reflective", image: "https://cdn.cartpe.in/images/gallery_sm/678b85d68852c.jpeg", price: 3000, category: "Other" },
  { name: "ADDIDAS YEEZY 350 V2 OREO", image: "https://cdn.cartpe.in/images/gallery_sm/678b84f3142a3.jpeg", price: 3000, category: "Other" },
  { name: "ADDIDAS YEEZY 350 ONYX BLACK SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/678b81fb2bd06.jpeg", price: 3200, category: "Other" },
  { name: "ADDIDAS YEEZY 350 CARBON BELUGA", image: "https://cdn.cartpe.in/images/gallery_sm/678b803d24661.jpeg", price: 3000, category: "Other" },
  { name: "ADDIDAS YEEZY 350 FULL WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/678b7743b955d.jpeg", price: 3000, category: "Other" },
  { name: "NEWW BALANCE 9060 black grey", image: "https://cdn.cartpe.in/images/gallery_sm/6779479e55583.jpeg", price: 3500, category: "Other" },
  { name: "E sb dunk parra", image: "https://cdn.cartpe.in/images/gallery_sm/6746b1e4c11b3.jpeg", price: 3000, category: "Other" },
  { name: "ONITSUKA TIGER SLIP ON BLACK YELLOW", image: "https://cdn.cartpe.in/images/gallery_sm/674095359face.jpeg", price: 2800, category: "Other" },
  { name: "NIIKE sb dunk low kentucky blue sale", image: "https://cdn.cartpe.in/images/gallery_sm/673a2fbee2770.jpeg", price: 2500, category: "Other" },
  { name: "NIIKEE sb dunk low panda for", image: "https://cdn.cartpe.in/images/gallery_sm/673a2e38d164c.jpeg", price: 2800, category: "Other" },
  { name: "NIKEE AIR JORDAN RETRO 1 LOW DIORR SHORT SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/673355c6d54d5.jpeg", price: 3200, category: "Other" },
  { name: "skercherss go run Maxroad 6 Hyper full black Sale", image: "https://cdn.cartpe.in/images/gallery_sm/672e1be020d47.jpeg", price: 3000, category: "Other" },
  { name: "UNNDER ARMOUR ua 2015 curry 1 mvp black gold", image: "https://cdn.cartpe.in/images/gallery_sm/6710bde627825.jpeg", price: 4200, category: "Other" },
  { name: "sb dunk low university red Sale", image: "https://cdn.cartpe.in/images/gallery_sm/670b93b68fc5b.jpeg", price: 2500, category: "Other" },
  { name: "Onitsuka Tiger Tonyuton Stay with me Pink SALE", image: "https://cdn.cartpe.in/images/gallery_sm/66d1e32759943.jpeg", price: 2500, category: "Other" },
  { name: "Balenciagaa 3 XL BLACK Sale", image: "https://cdn.cartpe.in/images/gallery_sm/66d1e3000dd32.jpeg", price: 4000, category: "Other" },
  { name: "AIR JORDAN RETRO 1 UNION STROM", image: "https://cdn.cartpe.in/images/gallery_sm/66d1e2004e3ad.jpeg", price: 3500, category: "Other" },
  { name: "ADIDASS ULTRA BOOST 21 FULL WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/66bbaa5c41656.jpeg", price: 3000, category: "Other" },
  { name: "S ultraboost 21 white neon ms dhoni edition", image: "https://cdn.cartpe.in/images/gallery_sm/66bba9e8b69c8.jpeg", price: 3000, category: "Other" },
  { name: ". go run maxroad black blue sale", image: "https://cdn.cartpe.in/images/gallery_sm/66bba99b7ced5.jpeg", price: 3000, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 BROWN SALE", image: "https://cdn.cartpe.in/images/gallery_sm/66abd926c6c21.jpeg", price: 2500, category: "Other" },
  { name: "ONITSUKA TIGER MEXICO 66 WHITE GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/66abd6bddfb69.jpeg", price: 2800, category: "Other" },
  { name: "ADIDDAS x WALE BONNERS TIGER PRINT Sale", image: "https://cdn.cartpe.in/images/gallery_sm/6660867b8fadb.jpeg", price: 2500, category: "Other" },
  { name: "Asicss Gel Novablast 3 Multi Colour Sale", image: "https://cdn.cartpe.in/images/gallery_sm/666039a91c518.jpeg", price: 2500, category: "Other" },
  { name: "New Balance 550 Sky Blue Mens SALE", image: "https://cdn.cartpe.in/images/gallery_sm/661f69f389f64.jpeg", price: 2500, category: "Other" },
  { name: "Vans Checkboard long mens Sale", image: "https://cdn.cartpe.in/images/gallery_sm/65dda64d956f5.jpeg", price: 1500, category: "Other" },
  { name: "Louis Vuitton Skate Trainer Blue Sale", image: "https://cdn.cartpe.in/images/gallery_sm/65d3543239ec1.jpeg", price: 2500, category: "Other" },
  { name: "ADDIDAS YEEZY slide bone lite SALE", image: "https://cdn.cartpe.in/images/gallery_sm/65d0aab711413.jpeg", price: 1500, category: "Other" },
  { name: "GUCC I LOAFERS BLACK Sale", image: "https://cdn.cartpe.in/images/gallery_sm/65aa917328b00.jpeg", price: 1500, category: "Loafers" },
  { name: "GUCC I LOAFERS BROWN Sale", image: "https://cdn.cartpe.in/images/gallery_sm/65aa8fa4eff19.jpeg", price: 1500, category: "Loafers" },
  { name: "convers all star black long Sale", image: "https://cdn.cartpe.in/images/gallery_sm/6569b1a837aaf.jpeg", price: 1500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 PHANTOM BLACK Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e1c53cf443.jpeg", price: 2500, category: "Other" },
  { name: "yeezy boost 350 black blue Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e1a38d64c2.jpeg", price: 2500, category: "Other" },
  { name: "Air Jordan Retro 4 Thunder Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e1656bbfc7.jpeg", price: 2500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 UNC sami ua Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e11be562b1.jpeg", price: 3000, category: "Other" },
  { name: "AIR JORDAN RETRO 1 MILAN Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e0ee4580e7.jpeg", price: 2300, category: "Other" },
  { name: "Louis Vuitton Trainer Maxi Black White Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e0799530cd.jpeg", price: 2500, category: "Other" },
  { name: "Louis Vuitton TRAINER Maxi Blue Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655e070e0cedd.jpeg", price: 2500, category: "Other" },
  { name: "AIR JORDAN RETRO 1 BLACK TOE LONG  WOMEN Sale", image: "https://cdn.cartpe.in/images/gallery_sm/655dfca80415f.jpeg", price: 2500, category: "Other" },
  { name: "LOUIS VUITTON TRAINER LONG PURPLE Sale", image: "https://cdn.cartpe.in/images/gallery_sm/6520fbf56a871.jpeg", price: 2500, category: "Other" },
  { name: "air jordan retro 1 low travis scott x golf Sale", image: "https://cdn.cartpe.in/images/gallery_sm/651ed9c693424.jpeg", price: 2500, category: "Other" },
  { name: "sb dunk low ebay Sale", image: "https://cdn.cartpe.in/images/gallery_sm/651ead601a12a.jpeg", price: 2500, category: "Other" },
  { name: "all star comme des gar ons play x  chuck 70 high top sneakers Sale", image: "https://cdn.cartpe.in/images/gallery_sm/63d3deccf1c54.jpeg", price: 1999, category: "Shoes" },
  { name: "all star white short", image: "https://cdn.cartpe.in/images/gallery_sm/635a535b549dd.jpeg", price: 1600, category: "Other" },
  { name: "FOAM RUNNER BLACK ORANGE Sale", image: "https://cdn.cartpe.in/images/gallery_sm/63145cb457dfa.jpeg", price: 1500, category: "Other" },
  { name: "VANS OLD SKOOL MULTI Sale", image: "https://cdn.cartpe.in/images/gallery_sm/631454ef7b406.jpeg", price: 1500, category: "Other" },
  { name: "Airforce 1 low an20 white black 336", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdf2ac60f50.jpg", price: 3200, category: "Other" },
  { name: "Hoka Project Transport White Cosmic Grey 278", image: "https://cdn.cartpe.in/images/gallery_sm/68dbded66fd29.jpeg", price: 4200, category: "Other" },
  { name: "Adida_ss Samba white sky blue suede with extra lace 222", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdcd52598b3.jpg", price: 2800, category: "Other" },
  { name: "Arman_i Exchange Gunmetal - J1727", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdc440b6e50.jpg", price: 1899, category: "Other" },
  { name: "NIK.E AIR JORDAN 1 RETRO HIGH LUCKY GREEN SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdbdc65a8e0.jpg", price: 3199, category: "Other" },
  { name: "Hublo_t Bigbang Tourbillion - J1726", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdbbf08ed40.jpg", price: 1549, category: "Other" },
  { name: "ADIDA.S YEEZY BOOST 350 YECHEL REFLECTIVE SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdba67388c0.jpg", price: 3199, category: "Other" },
  { name: "Hublo_t Bigbang Tourbillion - J1725", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdb9709d7d0.jpg", price: 1549, category: "Other" },
  { name: "Hublo_t Bigbang Tourbillion - J1724", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdb4a141f40.jpg", price: 1549, category: "Other" },
  { name: "NIK.E AIR FORCE 1 BIG BANG CHUNKY LACE", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdb50928550.jpg", price: 3199, category: "Other" },
  { name: "Otomo katsuhiro sb dunk low steamboy 102", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdaf0548650.jpg", price: 3200, category: "Other" },
  { name: "Hoka One One - Mafate Three2 - Olive", image: "https://cdn.cartpe.in/images/gallery_sm/68dbdac97725f.jpeg", price: 4000, category: "Other" },
  { name: "Hoka One One - Mafate Three2 - Oat Milk Eucalyptus", image: "https://cdn.cartpe.in/images/gallery_sm/68dbda2e91398.jpeg", price: 4000, category: "Other" },
  { name: "Airforce 1 low hemp coconut 499", image: "https://cdn.cartpe.in/images/gallery_sm/68dbda0c3dcae0.jpeg", price: 3200, category: "Other" },
  { name: "SEIKO 5 sports WATCH black 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd979f322d0.jpg", price: 1949, category: "Luxury Watch" },
  { name: "SEIKO 5 sports WATCH green 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd95c87f5b0.jpg", price: 1949, category: "Luxury Watch" },
  { name: "SEIKO 5 sports WATCH blue 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd9370018d0.jpg", price: 1949, category: "Luxury Watch" },
  { name: "SEIKO 5 sports WATCH red 014", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd911797a70.jpg", price: 1949, category: "Luxury Watch" },
  { name: "Hoka X Satisfy Mafate Speed 4 Light Rubber Brown 277", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd83ee1fb3.jpeg", price: 4000, category: "Other" },
  { name: "Adidass Bad Bunny Forum Cloud White 276", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd6c42e779.jpeg", price: 3200, category: "Other" },
  { name: "Onitsuk_aa tiger mexico 66 SD Cream Black Orange", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd64c78dfc0.jpg", price: 3499, category: "Other" },
  { name: "Adidass Bad Bunny Grey 275", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd605e2211.jpeg", price: 3200, category: "Other" },
  { name: "Maybach silver black shaded 1610", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd56c1ff580.jpg", price: 1100, category: "Other" },
  { name: "Adidass Wonder Runner Blue Black 274", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd56f7a155.jpeg", price: 4000, category: "Other" },
  { name: "Onitsuk_aa tiger mexico 66 SD Birch Peacoat Green For Men", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd517d9d2b0.jpg", price: 3499, category: "Other" },
  { name: "Adidass Wonder Runner Beige Black 273", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd448b2995.jpeg", price: 4000, category: "Other" },
  { name: "Lacostee Audyssor trail Navy Blue 272", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd3751d959.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "Lacostee Audyssor Trail White 122", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd2e2b216f.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "Gshock Ga 2100 Manga Edition All working", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd1b0ebb060.jpeg", price: 1649, category: "Other" },
  { name: "Tory_Burch_Big_Tote_Jacquard_Signature_With_Pouch_Blue_With_Dust_Bag_Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd10871fb00.jpg", price: 3399, category: "HandBags and Bag" },
  { name: "Yeez yy 350 V2 Onyx Semi Ua With Accessories 447", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd0f6b4bfb0.jpg", price: 3199, category: "Other" },
  { name: "Tory_Burch_Big_Tote_Jacquard_Signature_With_Pouch_Brown_With_Dust_Bag_Brown", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd0b0c2fb70.jpg", price: 3399, category: "HandBags and Bag" },
  { name: "Jorda_nn 1 High lost and found powder sole semi ua 363", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcfc7f10ef0.jpg", price: 3299, category: "Other" },
  { name: "Balmaiiin Unicorn Low Sneaker Neoprene & Calfskin", image: "https://cdn.cartpe.in/images/gallery_sm/68dbce9b685950.jpeg", price: 10999, category: "Shoes" },
  { name: "PRAD_A BROWN  CORD SET TRACK  SHIRT METAL LOGO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcd41bef1f0.jpeg", price: 2499, category: "Shirts & Tshirt" },
  { name: "Loewe X On Cloudtilt 2 0 White Navy", image: "https://cdn.cartpe.in/images/gallery_sm/68dbccd102bb2.jpeg", price: 3700, category: "Other" },
  { name: "Air Jordan Travis Scott X Jordan Jumpman Jack University Red Semi UA QUALITY", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcc5611d14.jpeg", price: 4200, category: "Other" },
  { name: "CONVERSEE X DUNGEONS DRAGONS CHUCK70 271", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcc2a8399a.jpeg", price: 3400, category: "Other" },
  { name: "_G-Shock_GM-2100_Grey_15", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcbe3bec510.jpg", price: 1750, category: "Other" },
  { name: "Lacostee. Audyssor Trail", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcbe46daa6.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "Travis Scott x Jordan Jumpman Jack TR Dark Mocha SEMI UA QUALITY", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcbcbc29ec.jpeg", price: 4200, category: "Other" },
  { name: "On Running Cloudtilt Ultramarine Eclipse White Blue 270", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcb41f23a0.jpeg", price: 3700, category: "Shoes" },
  { name: "Lacostee. Audyssor Trail", image: "https://cdn.cartpe.in/images/gallery_sm/68dbcb1594f83.jpeg", price: 3600, category: "Shirts & Tshirt" },
  { name: "PRAD_A BEIGE GREY CORD SET TRACK  SHIRT METAL LOGO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbca4bab5ed0.jpeg", price: 2499, category: "Shirts & Tshirt" },
  { name: "On Running Loewe Cloudtilt Sneaker Blue 269", image: "https://cdn.cartpe.in/images/gallery_sm/68dbca035528b.jpeg", price: 3700, category: "Shoes" },
  { name: "PRAD_A GREY CORD SET TRACK  SHIRT METAL LOGO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc9f9a56ff0.jpeg", price: 2499, category: "Shirts & Tshirt" },
  { name: "PRAD_A LIGHT GREY  CORD SET TRACK  SHIRT METAL LOGO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc9c362dd30.jpeg", price: 2499, category: "Shirts & Tshirt" },
  { name: "PRAD_A BLACK CORD SET TRACK  SHIRT METAL LOGO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc997e4c240.jpeg", price: 2499, category: "Shirts & Tshirt" },
  { name: "New.Balance 9060 Sea Salt Castlerock 268", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc9a5ada0e.jpeg", price: 3800, category: "Other" },
  { name: "Jorda_nn 1 High Washed Black Grey Denim Semi UA 243", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc965a3e880.jpg", price: 3299, category: "Other" },
  { name: "Nikee Air Jordan retro 4 University Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc949328e0.jpeg", price: 3600, category: "Other" },
  { name: "Nike_Airforce_1_Black-Orange_659", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc86fc901f.jpeg", price: 3200, category: "Other" },
  { name: "Gucci_WMNS_2914_Water_Brown_Shaded", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc7f2d0a700.jpeg", price: 1100, category: "Other" },
  { name: "Puma_SpeedCat_OG_Whiye_Navy_823", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc7dab9883.jpeg", price: 3300, category: "Other" },
  { name: "New.Balance 9060 Slate Grey Rain Cloud 267", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc74cb1f4b.jpeg", price: 3800, category: "Other" },
  { name: "Puma_SpeedCat_OG_Dark_Brown_822", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc5fab8893.jpeg", price: 3300, category: "Other" },
  { name: "RALPH LAURE_N POLO NAVY MAROON PREMIUM TEDDY SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc5c96fb4c0.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO MAROON NAVY PREMIUM TEDDY SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc592825d60.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO BLACK GREEN PREMIUM TEDDY SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc5672a1aa0.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO GREEN NAVY PREMIUM TEDDY SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc52d3254d0.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO WHITE NAVY PREMIUM TEDDY SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc4fccfcb60.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "Gucc i Black Monogram Premium Shirt With Brand Box Packing and carry bag F2722-BL", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd12e2f29c7.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "LACOST_E RED  PREMIUM IMPORTED POLO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc4840d47a0.jpeg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Adidass Wonder Runner Turbo Metallic Silver Blue 266", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc479128a1.jpeg", price: 4000, category: "Other" },
  { name: "Adidas_Wonder_Runner_Beige_Black_821", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc466cecd0.jpeg", price: 4000, category: "Other" },
  { name: "LACOST_E CREME PREMIUM IMPORTED POLO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc444a1c8d0.jpeg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Adida s Round Neck T shirt With Printed Brand Logo White 1934", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc43b2e7db0.jpg", price: 1699, category: "Shirts & Tshirt" },
  { name: "S gel kayano 31 platinum", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc43ec458d0.jpg", price: 3799, category: "Other" },
  { name: "New_Balance 9060 Bodega", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc433479c20.jpg", price: 3999, category: "Other" },
  { name: "Tiziana Terenzi    Orza Extrait De Parfum", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc3d29ff440.jpeg", price: 3700, category: "Perfumes" },
  { name: "Gucc i White Monogram Premium Shirt With Brand Box Packing and carry bag F2722-WH", image: "https://cdn.cartpe.in/images/gallery_sm/68dbd030e4afa0.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "LACOST_E ROYAL BLUE PREMIUM IMPORTED POLO", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc3b17fa670.jpeg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Nikee Air Jordan retro 4 White Cement Semi Ua quality", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc3b426661.jpeg", price: 3600, category: "Other" },
  { name: "Christian Dio r Black Premium Cotton Lycra Pique fabric Polo Tshirt with Collar Design and Embroidered Logo 2885", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc3ad5ee510.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO DARK KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc31f1b0d80.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "Adidas_Wonder_Runner_White_Black_820", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc2f062c55.jpeg", price: 4000, category: "Other" },
  { name: "Gucc i Beige Premium Polo TShirt with 240 gsm interlock cotton lycra fabric and All Over monogram Printed 2522", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc28374ee00.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Nike_Air_Jordan_Why_Not_6_Rattan_Black_819", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc25b77a1b.jpeg", price: 3800, category: "Other" },
  { name: "RALPH LAURE_N POLO BROWN KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc236244360.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "sb dunk low jerritos 498", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc2000020f0.jpg", price: 3200, category: "Other" },
  { name: "Adidas_Harden_Vol_9_Ice_Metallic_818", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc1c10819c.jpeg", price: 4200, category: "Other" },
  { name: "On Running Cloud Boom Strike Black White 265", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc18864748.jpeg", price: 3800, category: "Shoes" },
  { name: "Nik_ee blazer mid vintage white", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc1353b59e0.jpg", price: 2999, category: "Other" },
  { name: "RALPH LAURE_N POLO BOTTLE GREEN KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc0ef5f7080.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "RALPH LAURE_N POLO BEIGE KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc0c46da6e0.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "_Nike_ZoomX_Vaprofly_Glacier_Blue_817", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc0cd059a9.jpeg", price: 3600, category: "Other" },
  { name: "RALPH LAURE_N POLO GREEN KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc0442d0b60.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "On Running Cloud Boom Strike White Horizon 264", image: "https://cdn.cartpe.in/images/gallery_sm/68dbc00d96df8.jpeg", price: 3800, category: "Shoes" },
  { name: "RALPH LAURE_N POLO CREME KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbfbbd83c50.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "Dunk low pro parra with extra laces 443", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbf86b8b533.jpg", price: 3200, category: "Other" },
  { name: "RALPH LAURE_N POLO BROWN KNITTED PREMIUM ELBOW WORK", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbf7261ff70.jpeg", price: 2299, category: "Shirts & Tshirt" },
  { name: "Nike_Alphafly_3_Metallic_Medium_816", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbef6bb50c.jpeg", price: 3800, category: "Other" },
  { name: "NIK_E DISTRESSED RED WHITE PREMIUM WIND SHEETER", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbeca204bf0.jpeg", price: 2450, category: "Other" },
  { name: "NIK_E DISTRESSED BLUE WHITE PREMIUM WIND SHEETER", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbe97c95470.jpeg", price: 2450, category: "Other" },
  { name: "NIK_E DISTRESSED RED WHITE  PREMIUM WIND SHEETER", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbe6f56d200.jpeg", price: 2450, category: "Other" },
  { name: "NIK_E DISTRESSED GREY BLACK  PREMIUM WIND SHEETER", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbe39127270.jpeg", price: 2450, category: "Other" },
  { name: "Michael_kors Jet Set Medium Logo leather Pocket Tote Bag 268", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbe0f9d6be0.jpeg", price: 2798, category: "HandBags and Bag" },
  { name: "NIK_E DISTRESSED BLACK WHITE PREMIUM WIND SHEETER", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbdf1dc2890.jpeg", price: 2450, category: "Other" },
  { name: "Role x Sky Dweller", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbde124dfe0.jpeg", price: 1700, category: "Other" },
  { name: "Gucc i Beige Premium Polo T shirt With 240 gsm interlock cotton lycra fabric and Collar Design 2429", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbdd8d5f9d0.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Role x Sky Dweller", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbdce40d400.jpeg", price: 1700, category: "Other" },
  { name: "Michael_kors Jet Set Medium Logo leather Pocket Tote Bag 269", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbdd283ce90.jpeg", price: 2798, category: "HandBags and Bag" },
  { name: "Role x Sky Dweller", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbda7628fd0.jpeg", price: 1700, category: "Other" },
  { name: "Role x Sky Dweller", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbd88d778b0.jpeg", price: 1700, category: "Other" },
  { name: "Role x Sky Dweller", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbd6decdb40.jpeg", price: 1700, category: "Other" },
  { name: "MICHAEL_KORS  Whitney Signature Small Tote Bag 360", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbd72a48720.jpeg", price: 2598, category: "HandBags and Bag" },
  { name: "Burberr y Classic Polo With 240 Gsm Interlock Cotton Lycra Fabric Black 1728", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbd3f072540.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "MICHAEL_KORS Brown Whitney Signature Small Tote Bag 359", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbd39941630.jpeg", price: 2598, category: "HandBags and Bag" },
  { name: "Adidas_Harden_Vol_9_HellCat_815", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbcf0dc5b0.jpeg", price: 4200, category: "Other" },
  { name: "Balmai n designer polo with rubber metal logo With 240Gsm Interlock Cotton Lycra Fabric Polo (1542)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbcb13551d0.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Gucc_I Blondie hand bag With folding box 288", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbca54898a0.jpeg", price: 3498, category: "HandBags and Bag" },
  { name: "Adidas_Harden_Vol_9_Pearlized_814", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbc30f0815.jpeg", price: 4200, category: "Other" },
  { name: "Adida_s Samba OG Maroon", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbc13407fa1.jpg", price: 2999, category: "Other" },
  { name: "Michael_kors jet set logo crossbody bag with tossel With box 542", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbc04954bb0.jpeg", price: 2798, category: "HandBags and Bag" },
  { name: "Michael_kors jet set logo crossbody bag with tossel With box 543", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbbd23b75e0.jpeg", price: 2798, category: "HandBags and Bag" },
  { name: "Tommy Hilfige r Premium Polo Embroidery Logo With pocket Style Black 2191", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbb7fb379f0.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Gucc i Navy Premium Polo TShirt with 275 gsm Pique 4way lycra fabric and Jaquard Collar with Embroidered Logo 2533", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbb109ffdd0.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Lacoste_T_Clip_Winter_Black_Sneaker_813", image: "https://cdn.cartpe.in/images/gallery_sm/68dbbadbb71ef.jpeg", price: 4000, category: "Shoes" },
  { name: "Rare Rabbit Premium Polo With Collar Design 240GSM Interlock Cotton Lycra Fabric Maroon 1908", image: "https://cdn.cartpe.in/images/gallery_sm/68dbba58ad27c0.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Arman i Exchange Premium Imported Polo T shirt Cotton Matty Fabric White 2371", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb9f6017740.jpg", price: 1799, category: "Shirts & Tshirt" },
  { name: "Gucci_duffle_bag_with_dust_bag_517", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb9894a66e0.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "Gucci_duffle_bag_with_dust_bag_517", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb9894a66e0.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "GUCCI_DUFFLE_BAG_PREMIUM_QUALITY_5487", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb96f085660.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "GUCCI_DUFFLE_BAG_PREMIUM_QUALITY_5486", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb944af0440.png", price: 3498, category: "HandBags and Bag" },
  { name: "Michael_Kors_womens_eliza_open_mini tote_2091", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb8df46e1c0.jpg", price: 2999, category: "HandBags and Bag" },
  { name: "Christian-dior-lady-latest-edition-with-brand-box-5201", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb8b79ca8c0.jpg", price: 3999, category: "Other" },
  { name: "Christian-dior-lady-latest-edition-with-brand-box-5200", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb8959cb570.jpg", price: 3999, category: "Other" },
  { name: "Coach_tabby_sig_cc_26_leather_shoulder_bag_with_box_895", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb868508440.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "Tisso_t 1853 couturier", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb852c7ee00.jpeg", price: 1649, category: "Other" },
  { name: "Louis_Vuitton_Bolsa_Soul_Trunk_East_West_with_box_2077", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb846972fa0.jpg", price: 3499, category: "Other" },
  { name: "Michael_Kors_HENDRIX SLING WITH BOX DUST COVER 544", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb80fdecb80.jpg", price: 3199, category: "Other" },
  { name: "_Cartier-Paris_Silver-Brown_11", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb85289b420.jpg", price: 2050, category: "Luxury Watch" },
  { name: "Louis_vuitton_2254_gold_black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb710d4c580.jpeg", price: 1100, category: "Other" },
  { name: "Mossimo Dutti Light Brown Premium Classic Shirt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb5100d1850.jpeg", price: 1899, category: "Shirts & Tshirt" },
  { name: "Mossimo Dutti Sky Blue Premium Classic Shirt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb4e4ca8c60.jpeg", price: 1899, category: "Shirts & Tshirt" },
  { name: "Guccci rhyton sneakers", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb466923500.jpg", price: 4499, category: "Shoes" },
  { name: "Nik_e Airforce 1 Low Tiffany Black Semi UA", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb42774eb50.jpg", price: 3499, category: "Other" },
  { name: "Mossimo Dutti Wine Premium Classic Shirt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb4126fda20.jpeg", price: 1899, category: "Shirts & Tshirt" },
  { name: "Lacoste_T_Clip_Winter_Sneaker_812", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb3f00e239.jpeg", price: 4000, category: "Shoes" },
  { name: "Fossi l Automatic (Open back)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb497c012b1.jpeg", price: 2699, category: "Luxury Watch" },
  { name: "Tisso_t 1853 couturier", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb3fb1c6a70.jpeg", price: 1649, category: "Other" },
  { name: "Ysl_Saint_Laurent_Shoulder_Hobo_Bag_Glossy_With_Box_Dustbag", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb34ff0ba40.jpg", price: 2999, category: "HandBags and Bag" },
  { name: "COAC_H handbag slingbag with folding box 159", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb346dcfcf0.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "COAC_H handbag slingbag with folding box 157", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb365451541.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Christian Dio r All Black Star Edition Luxury Shade 3342", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb8f3425770.jpeg", price: 1099, category: "Other" },
  { name: "Coac_h league messenger bag in signature With folding box 263", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb2a47be6e0.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Adidaass Wonder Runner Turbo Red", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb2a544f9e0.jpg", price: 3700, category: "Other" },
  { name: "Coac_h league messenger bag in signature With folding box 262", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb285c21a90.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Coac_h league messenger bag in signature With folding box 259", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb25bb0d9f0.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Fend_i Baguette Chain Midi with og box 295", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb21b1aede0.jpeg", price: 3198, category: "HandBags and Bag" },
  { name: "Ami Paris Black Embroidery Logo Premium Shirt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb200486d00.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "RAYBAN SILVER BLACK 528", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb204cf62f0.jpg", price: 1100, category: "Other" },
  { name: "Hublot Automatic Leather 015", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb1ebf3ceb0.jpeg", price: 2349, category: "Luxury Watch" },
  { name: "Fend_i Baguette Chain Midi with og box 294", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb1f2654010.jpeg", price: 3198, category: "HandBags and Bag" },
  { name: "Celine_premium_large_dufflebag_with_dustbag_lockkey_tags_etc_223", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb1d31f7b50.jpeg", price: 3399, category: "HandBags and Bag" },
  { name: "Fend_i Baguette chain midi with og box 293", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb1b1871d70.jpeg", price: 3198, category: "HandBags and Bag" },
  { name: "Ami Paris White Embroidery Logo Premium Shirt", image: "https://cdn.cartpe.in/images/gallery_sm/68dbb09f5b6a70.jpeg", price: 1849, category: "Shirts & Tshirt" },
  { name: "Ralph  Lauren Light Grey Embroidery Logo Premium TrackPant", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf87dc9d40.jpeg", price: 1799, category: "Jeans & Trouser & Trackpant" },
  { name: "Adidas_Wonder_Runner_Grey_Black_760", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf6e79fa8.jpeg", price: 4000, category: "Other" },
  { name: "Guess Womens Lisbet 2 Satchel with dust cover 431", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf6314d790.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Ralph  Lauren Navy Blue Embroidery Logo Premium TrackPant", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf5c754960.jpeg", price: 1799, category: "Jeans & Trouser & Trackpant" },
  { name: "Guess Womens Lisbet 2 Satchel with dust cover 433", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf26586b90.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Ralph  Lauren Cream Embroidery Logo Premium TrackPant", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaf1938f460.jpeg", price: 1799, category: "Jeans & Trouser & Trackpant" },
  { name: "GUESS Lisbet Mini Womens Shoulder Bag with box 434", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaef71d8720.jpeg", price: 3398, category: "HandBags and Bag" },
  { name: "GUESS Lisbet Mini Womens Shoulder Bag with box 436", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaecd093650.jpeg", price: 3398, category: "HandBags and Bag" },
  { name: "GUESS Lisbet Mini Womens Shoulder Bag with box 435", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaeab8a33c0.jpeg", price: 3398, category: "HandBags and Bag" },
  { name: "Ralph  Lauren Brown Embroidery Logo Premium TrackPant", image: "https://cdn.cartpe.in/images/gallery_sm/68dbae94c229f0.jpeg", price: 1799, category: "Jeans & Trouser & Trackpant" },
  { name: "Gucc_i heart pochette shape sling bag with box 110", image: "https://cdn.cartpe.in/images/gallery_sm/68dbae7a468340.jpeg", price: 2898, category: "HandBags and Bag" },
  { name: "Adidas_Runner_Wonder_Green_811", image: "https://cdn.cartpe.in/images/gallery_sm/68dbae4b9536c.jpeg", price: 4000, category: "Other" },
  { name: "Adidaass Wonder Runner Grey Black", image: "https://cdn.cartpe.in/images/gallery_sm/68dbae342c0870.jpg", price: 3999, category: "Other" },
  { name: "LOUIS_VUITTON OFFICIER POUCH SLING BAG WITH OG DUST BAG & OG BOX 257", image: "https://cdn.cartpe.in/images/gallery_sm/68dbadf7487b00.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "Ralph  Lauren Black Embroidery Logo Premium TrackPant", image: "https://cdn.cartpe.in/images/gallery_sm/68dbadc7deaad0.jpeg", price: 1799, category: "Jeans & Trouser & Trackpant" },
  { name: "LOUIS_VUITTON OFFICIER POUCH SLING BAG WITH OG DUST BAG & OG BOX 256", image: "https://cdn.cartpe.in/images/gallery_sm/68dbadd7664470.jpeg", price: 3298, category: "HandBags and Bag" },
  { name: "GUESS Eco Tote Mietta Noelstone with dust cover bag 544", image: "https://cdn.cartpe.in/images/gallery_sm/68dbad8eae29e0.png", price: 2998, category: "HandBags and Bag" },
  { name: "S samba cream sand strata", image: "https://cdn.cartpe.in/images/gallery_sm/68dbad892fa4d0.jpg", price: 3199, category: "Other" },
  { name: "GUESS Eco Tote Mietta Noelstone with dust cover bag 423", image: "https://cdn.cartpe.in/images/gallery_sm/68dbad6ab0abe1.jpeg", price: 2998, category: "HandBags and Bag" },
  { name: "Nike_AirForce_1_Low_Oreo_Coco_810", image: "https://cdn.cartpe.in/images/gallery_sm/68dbad34a2c47.jpeg", price: 3300, category: "Other" },
  { name: "louis-vuitton side trunk denim 1 with magnetic box 01", image: "https://cdn.cartpe.in/images/gallery_sm/68dbacfa8aa5c0.jpeg", price: 3498, category: "Other" },
  { name: "VERSACE BLACK PREMIUM FULL PRINTED IMPORTED SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68dbabcfcb4130.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "Hublo t Bigbang Chronograph (All working)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbab09dbc201.jpeg", price: 1949, category: "Luxury Watch" },
  { name: "Hublo t Bigbang Chronograph (All working)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaad2f03ba1.jpeg", price: 1949, category: "Luxury Watch" },
  { name: "Hublo t Bigbang Chronograph (All working)", image: "https://cdn.cartpe.in/images/gallery_sm/68dbaa93217f11.jpeg", price: 1949, category: "Luxury Watch" },
  { name: "Nike_AirForce_1_07_Dior_809", image: "https://cdn.cartpe.in/images/gallery_sm/68dba9ddded7b.jpeg", price: 3300, category: "Other" },
  { name: "New_Balancee_9060_Black Castlerock", image: "https://cdn.cartpe.in/images/gallery_sm/68dba8c0786f3.jpeg", price: 3600, category: "Other" },
  { name: "_Adidas_Bad_Bunny_Forum_Brown_535", image: "https://cdn.cartpe.in/images/gallery_sm/68dba7c928ad1.jpeg", price: 3200, category: "Other" },
  { name: "Adidas_Bad_Bunny_Forum_Blue_Tint_534", image: "https://cdn.cartpe.in/images/gallery_sm/68dba757af5a8.jpeg", price: 3200, category: "Other" },
  { name: "Role_x couple watch silver green dial", image: "https://cdn.cartpe.in/images/gallery_sm/68dba660b66650.jpeg", price: 2299, category: "Luxury Watch" },
  { name: "Under_Armourr_Curry_12 Gravity", image: "https://cdn.cartpe.in/images/gallery_sm/68dba5d5b2f86.jpeg", price: 4000, category: "Other" },
  { name: "Role_x Oyster perpetual Gmt master", image: "https://cdn.cartpe.in/images/gallery_sm/68dba5b6a82540.jpeg", price: 3100, category: "Luxury Watch" },
  { name: "Nike_AirForce_1_07_Desert_Khaki_824", image: "https://cdn.cartpe.in/images/gallery_sm/68dba57e10abb.jpeg", price: 3300, category: "Other" },
  { name: "Prada_1014_Gold_Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68dba4b5bcea20.jpeg", price: 1100, category: "Other" },
  { name: "Versac e Designer Side Logo Glasses 8037", image: "https://cdn.cartpe.in/images/gallery_sm/68dba49a775640.jpeg", price: 1099, category: "Other" },
  { name: "Under_Armourr_Curry_12 Dub_Nation", image: "https://cdn.cartpe.in/images/gallery_sm/68dba426f07e6.jpeg", price: 4000, category: "Other" },
  { name: "On_CloudMonster_Women_WhiteLima_808", image: "https://cdn.cartpe.in/images/gallery_sm/68dba3ec62840.jpeg", price: 3700, category: "Other" },
  { name: "On_CloudMonster_Purple_807", image: "https://cdn.cartpe.in/images/gallery_sm/68dba368c04a3.jpeg", price: 3700, category: "Other" },
  { name: "Nikee Air Jordan Retro 4 Black Cat Semi UA", image: "https://cdn.cartpe.in/images/gallery_sm/68dba2cb4aec9.jpeg", price: 3600, category: "Other" },
  { name: "AUDEMERS PIGUE.T ROYAL OAK SWISS WATCH 012", image: "https://cdn.cartpe.in/images/gallery_sm/68dba157ea86f0.jpg", price: 1799, category: "Luxury Watch" },
  { name: "_Chanel_Rose-Gold_5", image: "https://cdn.cartpe.in/images/gallery_sm/68dba0f9e07ee0.jpg", price: 1700, category: "Other" },
  { name: "nik_e air more uptempo grey black  (1116", image: "https://cdn.cartpe.in/images/gallery_sm/68db9f2078f420.jpeg", price: 3500, category: "Other" },
  { name: "Louis_Vuittion_WavesBloom_Top_Handle_Bag_With_Box_Dustbag_SlingBelt", image: "https://cdn.cartpe.in/images/gallery_sm/68db9dd1b01220.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "Cartier_gold_brown_1027", image: "https://cdn.cartpe.in/images/gallery_sm/68db9d9bcfa7b0.jpg", price: 1100, category: "Luxury Watch" },
  { name: "OFFER Charles & kieth lumen hobo bag 38 cm (long)", image: "https://cdn.cartpe.in/images/gallery_sm/68db9cc0730370.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "OFFER Michael_kors_voyager tote bag with dust bag (4616-biege-)", image: "https://cdn.cartpe.in/images/gallery_sm/68db9c321bc100.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "_Michael_kors_voyager tote bag with dust bag (4616-black)", image: "https://cdn.cartpe.in/images/gallery_sm/68db9bc2d89e50.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "_Michael_kors tote bag with dust bag (23011-coffe-brown)", image: "https://cdn.cartpe.in/images/gallery_sm/68db9ba4520200.jpeg", price: 2499, category: "HandBags and Bag" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db9a38c990a0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db9a175ffcd0.jpeg", price: 1950, category: "Other" },
  { name: "New_ Balance Fresh Foam x Trail More v3 Black Red", image: "https://cdn.cartpe.in/images/gallery_sm/68db9a0dc4dd60.jpg", price: 3599, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db99f457e050.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db99b62e40d0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db99925181a0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db9967353fb0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db99467eef10.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db991bb41000.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db98f996e300.jpeg", price: 1950, category: "Other" },
  { name: "VERSACE WHITE PREMIUM FULL PRINTED IMPORTED SHIRT", image: "https://cdn.cartpe.in/images/gallery_sm/68db98daca6800.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db98a6ea06f0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db97a5f3d770.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db9761d17da0.jpeg", price: 1950, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db973f2c53f0.jpeg", price: 1950, category: "Other" },
  { name: "Nik.e Structure 26 White Black", image: "https://cdn.cartpe.in/images/gallery_sm/68db96b0917610.jpg", price: 3499, category: "Other" },
  { name: "M k Ladies Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68db96a29e17c0.jpeg", price: 1950, category: "Other" },
  { name: "Nik_ee V5 RNR Parachute Beige Metallic Pewter shoes", image: "https://cdn.cartpe.in/images/gallery_sm/68db959c5518d.jpeg", price: 3300, category: "Shoes" },
  { name: "Louis_vuitton Trainer Denim-Blue 165", image: "https://cdn.cartpe.in/images/gallery_sm/68db94ced3e67.jpeg", price: 3500, category: "Other" },
  { name: "Gucci_1390_grey", image: "https://cdn.cartpe.in/images/gallery_sm/68db9482d60e00.jpeg", price: 1100, category: "Other" },
  { name: "On Running Cloudtilt 2 x Loewe BlackWhitegrey", image: "https://cdn.cartpe.in/images/gallery_sm/68db941aceabe.jpeg", price: 3700, category: "Shoes" },
  { name: "pum aa suede xl Black brown With extra lace As3 432", image: "https://cdn.cartpe.in/images/gallery_sm/68db948097c270.jpg", price: 3300, category: "Other" },
  { name: "pum aa suede xl Black brown With extra lace As3 432", image: "https://cdn.cartpe.in/images/gallery_sm/68db943590ed11.jpg", price: 3300, category: "Other" },
  { name: "Balmaiinn Unicorn Platform Sneakers Olive Salmon", image: "https://cdn.cartpe.in/images/gallery_sm/68db934b7389c0.jpeg", price: 10999, category: "Shoes" },
  { name: "GUCC I BAMBOO EDP 75 ML FOR HER", image: "https://cdn.cartpe.in/images/gallery_sm/68db9320092890.jpeg", price: 1199, category: "Other" },
  { name: "Sale sale ROLE.X OYSTER PERPETUAL ROMAN WATCH 003 full goldgreen dial", image: "https://cdn.cartpe.in/images/gallery_sm/68db8ff08cf4b0.jpeg", price: 1599, category: "Luxury Watch" },
  { name: "Sale sale ROLEEX DAY DATE ROSE GOLD GREEN 003 Roman", image: "https://cdn.cartpe.in/images/gallery_sm/68db8fde900440.jpeg", price: 1599, category: "Other" },
  { name: "Marc Jacobs Medium The Tote Bag With OG Box & Dust Bag & Shoulder Strap (Orange - 460)", image: "https://cdn.cartpe.in/images/gallery_sm/68db8cdf6ae540.jpg", price: 3799, category: "HandBags and Bag" },
  { name: "Hermes Black Oran Wedge Platform Sandal  Heel With OG Box & Carry Bag Black Leather", image: "https://cdn.cartpe.in/images/gallery_sm/68db8c575d3a80.jpg", price: 3599, category: "HandBags and Bag" },
  { name: "Hermes Brown Oran Wedge Platform Sandal  Heel With OG Box & Carry Bag Brown Leather", image: "https://cdn.cartpe.in/images/gallery_sm/68db8bfe8043e0.jpg", price: 3599, category: "HandBags and Bag" },
  { name: "Lac Strip Shirt 06 K103-06", image: "https://cdn.cartpe.in/images/gallery_sm/68d7b186a985e0.jpg", price: 1900, category: "Shirts & Tshirt" },
  { name: "Lac Strip Shirt 05 K103-05", image: "https://cdn.cartpe.in/images/gallery_sm/68d7b18acbb340.jpg", price: 1900, category: "Shirts & Tshirt" },
  { name: "Lac Strip Shirt 03 K103-03", image: "https://cdn.cartpe.in/images/gallery_sm/68d7b1889803d0.jpg", price: 1900, category: "Shirts & Tshirt" },
  { name: "Adida.s  Adizero Adios Pro Evo 1 Pharrel Earth", image: "https://cdn.cartpe.in/images/gallery_sm/68db87371a3df0.jpeg", price: 3699, category: "Other" },
  { name: "Nik.e Zoom Pegasus 41 Sky Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68db8606c75b80.jpeg", price: 3199, category: "Other" },
  { name: "MOVADO_SILVER-GOLD-BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68db8574efc0f0.jpg", price: 2049, category: "Other" },
  { name: "Prada_1296_white_black", image: "https://cdn.cartpe.in/images/gallery_sm/68db845137c670.jpeg", price: 1100, category: "Other" },
  { name: "Marc Jacobs 1126 Water Black", image: "https://cdn.cartpe.in/images/gallery_sm/68db8320ad1cd0.jpeg", price: 1100, category: "Other" },
  { name: "MARCJACOB FRAME", image: "https://cdn.cartpe.in/images/gallery_sm/68db81aab3fee0.jpeg", price: 1100, category: "Other" },
  { name: "_LOUIS_VUITTON_MONOGRAM_WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68db819c3245a0.jpeg", price: 1899, category: "Other" },
  { name: "_LOUIS_VUITTON_MONOGRAM_BROWN", image: "https://cdn.cartpe.in/images/gallery_sm/68db8157c02a30.jpeg", price: 1899, category: "Other" },
  { name: "Coach_Eliza_Top_Handle_Premium_Crossbody_Bag_With_OG_Magnetic_Gift_Box_&_Dust_Bag_(Tan_Brown-912)", image: "https://cdn.cartpe.in/images/gallery_sm/68db7f95099b80.jpeg", price: 3999, category: "HandBags and Bag" },
  { name: "Coach_Eliza_Premium_Crossbody_Sling_Bag_With_OG_Magnetic_Gift_Box_&_Dust_Bag_(Tan_Brown-916)", image: "https://cdn.cartpe.in/images/gallery_sm/68db7ee4f252a0.jpeg", price: 3799, category: "HandBags and Bag" },
  { name: "RAYBAN 06 SILVER BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/68db7e2f7e9190.jpg", price: 1100, category: "Other" },
  { name: "Coach_Day_Tote_With_Removable_Pouch_&_Dust_Bag_(White-969)", image: "https://cdn.cartpe.in/images/gallery_sm/68db786cc87000.jpeg", price: 2899, category: "HandBags and Bag" },
  { name: "_Gucci_Ladies_Two_Tone_Rose_Green_14", image: "https://cdn.cartpe.in/images/gallery_sm/68db76b63bd820.jpeg", price: 1650, category: "Other" },
  { name: "fresh foam x more trail v3 trail green fix", image: "https://cdn.cartpe.in/images/gallery_sm/68db71c1479450.jpg", price: 3599, category: "Other" },
  { name: "GUCC_I SOHO LEATHER HANDBAG WITH OG BOX AND DUST (RED) (S5)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4d3cea9c80.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "GUCC_I SOHO LEATHER HANDBAG WITH OG BOX AND DUST BAG (BLACK) (S5)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4d1c107050.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "Celine Triomphe Classic Bag With Box And Dust Bag (White)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4ce3890d70.jpeg", price: 3499, category: "HandBags and Bag" },
  { name: "Celine Triomphe Classic Bag With Box And Dust Bag (Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4cbdf0fe30.jpeg", price: 3499, category: "HandBags and Bag" },
  { name: "COAC_H TRENDY SIGNATURE SATCHEL BAG WITH OG BOX AND DUST BAG PREMIUM QUALITY (COFFEE BROWN)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4c63b11120.jpeg", price: 3499, category: "HandBags and Bag" },
  { name: "CHRISTIAN DIO_R MONTAIGNE HANDBAG WITH OG BOX DUST BAG & CARRY BAG [PINK]", image: "https://cdn.cartpe.in/images/gallery_sm/68db4c158268f0.jpeg", price: 3199, category: "HandBags and Bag" },
  { name: "MICHAEL_KORS JET SET DUAL SHOULDER BAG WITH OG BOX AND DUST BAG (BLACK COFFEE)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4be374d2d0.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "Michael Kor_s Freya Small Convertible Crossbody Bag with original box & caary bag (BROWN)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4bb1833320.jpeg", price: 3199, category: "HandBags and Bag" },
  { name: "Coach_Teri_Shoulder_Bag_With_Box_And_Dust_Bag_(White)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4b62a37cd0.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "Coach_Teri_Shoulder_Bag_With_Box_And_Dust_Bag_(Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4b4000b300.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "Burberry_TB_Monogram_Quilted_Shoulder_Bag_With_Box_And_Dust_Bag_(Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4b08a9f880.jpeg", price: 3499, category: "HandBags and Bag" },
  { name: "Burberry_TB_Monogram_Quilted_Shoulder_Bag_With_Box_And_Dust_Bag_(brown)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4ad146fbc0.jpeg", price: 3499, category: "HandBags and Bag" },
  { name: "COACH_PREMIUM_SLING_BAG_WITH_DOUBLE_BOX_AND_DUST_BAG_INCLUDING_CARRYBAG_(BROWN_GRAFFITI)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4a7d004330.jpeg", price: 3800, category: "HandBags and Bag" },
  { name: "Louis_Vuitton Pochette Camille With Double Og Box And Dust Bag Including CarryBag (Brown)", image: "https://cdn.cartpe.in/images/gallery_sm/68db4a46b48ff0.jpeg", price: 3799, category: "HandBags and Bag" },
  { name: "COAC_H MORGAN CROSSBODY WITH OG DUST BAG & BOX PREMIUM QUALITY [ LIGHT COFFEE]", image: "https://cdn.cartpe.in/images/gallery_sm/68db4a12ce1eb0.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "COAC_H MORGAN CROSSBODY WITH OG DUST BAG & BOX PREMIUM QUALITY [BLUE]", image: "https://cdn.cartpe.in/images/gallery_sm/68db49d12b5af0.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "COAC_H MORGAN CROSSBODY WITH OG DUST BAG & BOX PREMIUM QUALITY [BROWN]", image: "https://cdn.cartpe.in/images/gallery_sm/68db499b44c070.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "Coach_Ace_Tote_Bag_Carryall_With_Box_And_Dust_Bag_(White)", image: "https://cdn.cartpe.in/images/gallery_sm/68db49198a85a0.jpeg", price: 4999, category: "HandBags and Bag" },
  { name: "Coach_Ace_Tote_Bag_Carryall_With_Box_And_Dust_Bag_(Full_White)", image: "https://cdn.cartpe.in/images/gallery_sm/68db48eef21500.jpeg", price: 4999, category: "HandBags and Bag" },
  { name: "Coach_Ace_Tote_Bag_Carryall_With_Box_And_Dust_Bag_(Horseferry)", image: "https://cdn.cartpe.in/images/gallery_sm/68db48c458f970.jpeg", price: 4999, category: "HandBags and Bag" },
  { name: "Coach_Ace_Tote_Bag_Carryall_With_Box_And_Dust_Bag_(Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68db48944f7bd0.jpeg", price: 4999, category: "HandBags and Bag" },
  { name: "On_Cloudtilt_Cinder_Sand_806", image: "https://cdn.cartpe.in/images/gallery_sm/68db0eaaa3147.jpeg", price: 3700, category: "Other" },
  { name: "Loewe_X_On_Cloudtilt_2.0_Triple White_805", image: "https://cdn.cartpe.in/images/gallery_sm/68db0d8bd84fa.jpeg", price: 3500, category: "Other" },
  { name: "AudemarsPiguet_AUTO_BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68daf61f4fc760.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_SILVER-BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/68daf5bbacde40.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_GREY", image: "https://cdn.cartpe.in/images/gallery_sm/68daf598310a00.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_PURPLE", image: "https://cdn.cartpe.in/images/gallery_sm/68daf57c94efa0.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_SILVER-GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/68daf55a0f8200.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_ROSE-BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/68daf538b6c630.jpeg", price: 3550, category: "Other" },
  { name: "AudemarsPiguet_AUTO_SKY-BLUE", image: "https://cdn.cartpe.in/images/gallery_sm/68daf51d762fc0.jpeg", price: 3550, category: "Other" },
  { name: "FRANK_MULLER_ROSE-BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68daec5ca160f0.jpeg", price: 1800, category: "Other" },
  { name: "PACO RABBAN E BLACK XS", image: "https://cdn.cartpe.in/images/gallery_sm/68dae5d1e95ad0.jpeg", price: 1199, category: "Other" },
  { name: "TOMFOR D BITTER PEACH 100 ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dae417b18ab0.jpeg", price: 1199, category: "Other" },
  { name: "DIO R FAHRENHEIT_EDT_100_ML", image: "https://cdn.cartpe.in/images/gallery_sm/68dae098a38ff0.jpeg", price: 1199, category: "Perfumes" },
  { name: "CREE D SPRING FLOWER", image: "https://cdn.cartpe.in/images/gallery_sm/68dadf087923d0.jpeg", price: 1199, category: "Other" },
  { name: "Richard Mille Mclaren Deep SkyBlue Chronograph Special Edition Watch", image: "https://cdn.cartpe.in/images/gallery_sm/68dade76cfbb00.jpeg", price: 2349, category: "Luxury Watch" },
  { name: "_Chromo heart_frame_", image: "https://cdn.cartpe.in/images/gallery_sm/68dad648216180.jpeg", price: 1099, category: "Other" },
  { name: "_Rayban_2175_", image: "https://cdn.cartpe.in/images/gallery_sm/68dad449bf1b60.jpeg", price: 1099, category: "Other" },
  { name: "Michael_Kors_Chantal_Medium_Logo_Satchel_Bag_With_Dust_Bag_Coffee_Brown_100817", image: "https://cdn.cartpe.in/images/gallery_sm/68dad3c6d7c640.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "Michael_Kors_Chantal_Medium_Logo_Satchel_Bag_With_Dust_Bag_Beige_Brown_100817", image: "https://cdn.cartpe.in/images/gallery_sm/68dad399c3c220.jpg", price: 3199, category: "HandBags and Bag" },
  { name: "Longine_s Automatic Watch", image: "https://cdn.cartpe.in/images/gallery_sm/68dad229d86770.jpeg", price: 3799, category: "Luxury Watch" },
  { name: "MOVADO_SILVER-GREEN", image: "https://cdn.cartpe.in/images/gallery_sm/68dabc28576620.jpg", price: 2049, category: "Other" },
  { name: "Onitsuka tiger Mexico 66 white Grey Blue Yellow (307", image: "https://cdn.cartpe.in/images/gallery_sm/68dab77b12f0f0.jpg", price: 2800, category: "Other" },
  { name: "_Tory_burch_miller_shoulder_bag_with_og_box", image: "https://cdn.cartpe.in/images/gallery_sm/68dab629b6e310.jpeg", price: 4299, category: "HandBags and Bag" },
  { name: "_Tory_burch_miller_shoulder_bag_with_og_box", image: "https://cdn.cartpe.in/images/gallery_sm/68dab594352990.jpeg", price: 4299, category: "HandBags and Bag" },
  { name: "Air_ jordann_ retro _1 travis scott _low _reverse_mocha (womens)", image: "https://cdn.cartpe.in/images/gallery_sm/68dab17fd81c0.jpeg", price: 3300, category: "Other" },
  { name: "Air jorda.n retro 1 travis scott low reverse mocha", image: "https://cdn.cartpe.in/images/gallery_sm/68dab032262d5.jpeg", price: 3200, category: "Other" },
  { name: "Dio.r b23 oblique low top sneaker white black canvas", image: "https://cdn.cartpe.in/images/gallery_sm/68daaf5fcc6f0.jpeg", price: 3500, category: "Shoes" },
  { name: "Dio.r B28 High Black Beige With All Accessories", image: "https://cdn.cartpe.in/images/gallery_sm/68daaeadab77d.jpeg", price: 3800, category: "Other" },
  { name: "Seiko 5 Sprots Automatic", image: "https://cdn.cartpe.in/images/gallery_sm/68daa7e5d2ec90.jpg", price: 6499, category: "Luxury Watch" },
  { name: "Nik.e Sb Dunk Low  Panda Leather Quality", image: "https://cdn.cartpe.in/images/gallery_sm/68daa6ace04200.jpeg", price: 3199, category: "Other" },
  { name: "Nik.e Air Jordan 1 Low Barons", image: "https://cdn.cartpe.in/images/gallery_sm/68daa5a1153e30.jpeg", price: 3199, category: "Other" },
  { name: "Arman_i Exchange Reflective Black Premium Shirt With Brand Box Packing And Carry Bag F2500-BL", image: "https://cdn.cartpe.in/images/gallery_sm/68daa6438f0ad6.jpeg", price: 1850, category: "Shirts & Tshirt" },
  { name: "Arman_i Exchange Reflective White Premium Shirt With Brand Box Packing And Carry Bag F2500-WH", image: "https://cdn.cartpe.in/images/gallery_sm/68daa5e2e54620.jpeg", price: 1850, category: "Shirts & Tshirt" },
  { name: "Cartie r Baignoir Womens 2412", image: "https://cdn.cartpe.in/images/gallery_sm/68daa4e4d1b000.jpeg", price: 1600, category: "Other" },
  { name: "Cartie r Baignoir Womens 2411", image: "https://cdn.cartpe.in/images/gallery_sm/68daa4aa155ca0.jpeg", price: 1600, category: "Other" },
  { name: "Cartie r Baignoir Womens 2410", image: "https://cdn.cartpe.in/images/gallery_sm/68daa42ece6950.jpeg", price: 1600, category: "Other" },
  { name: "Gucci_Horsebit_1955_Shoulder_Bag_With_Box", image: "https://cdn.cartpe.in/images/gallery_sm/68daa41c68d5d0.jpg", price: 3200, category: "HandBags and Bag" },
  { name: "Cartie r Baignoir Womens 2409", image: "https://cdn.cartpe.in/images/gallery_sm/68daa3ffa69ac0.jpeg", price: 1600, category: "Other" },
  { name: "Cartie r Baignoir_Womens", image: "https://cdn.cartpe.in/images/gallery_sm/68daa3a563b370.jpeg", price: 1800, category: "Other" },
  { name: "Gucci_Horsebit_1955_Shoulder_Bag_With_OriginalBox", image: "https://cdn.cartpe.in/images/gallery_sm/68daa383f21a80.jpg", price: 3200, category: "HandBags and Bag" },
  { name: "Cartie r Baignoir Womens 2407", image: "https://cdn.cartpe.in/images/gallery_sm/68daa3408a73f0.jpeg", price: 1600, category: "Other" },
  { name: "MICHAEL_KORS JET SET LEATHER POUCHETTE WITH OG BOX AND DUST BAG (BIEGE BROWN)", image: "https://cdn.cartpe.in/images/gallery_sm/68da9ffbb90970.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "MICHAEL_KORS JET SET LEATHER POUCHETTE WITH OG BOX AND DUST BAG (BROWN)", image: "https://cdn.cartpe.in/images/gallery_sm/68da9fa03ca9b0.jpeg", price: 2999, category: "HandBags and Bag" },
  { name: "Balmain_3202_black", image: "https://cdn.cartpe.in/images/gallery_sm/68da9e3c2ad540.jpg", price: 1100, category: "Other" },
  { name: "Us Polo Black Back Printed Collar Neck Premium T-shirt F2837-BL", image: "https://cdn.cartpe.in/images/gallery_sm/68da9d41589a40.jpeg", price: 1749, category: "Shirts & Tshirt" },
  { name: "Us Polo Blue Back Printed Collar Neck Premium T-shirt F2837-BU", image: "https://cdn.cartpe.in/images/gallery_sm/68da9cf75ebfc1.jpeg", price: 1749, category: "Shirts & Tshirt" },
  { name: "Louis_vuitton_gold_black_1519", image: "https://cdn.cartpe.in/images/gallery_sm/68da9b68a14ca0.jpg", price: 1100, category: "Other" },
  { name: "Us Polo Maroon Premium Printed Collar Neck T-shirt F2837-MA", image: "https://cdn.cartpe.in/images/gallery_sm/68da9ca9f18730.jpeg", price: 1749, category: "Shirts & Tshirt" },
  { name: "Us Polo White Back Printed Collar Neck Premium T-shirt F2837-WH", image: "https://cdn.cartpe.in/images/gallery_sm/68da9c2721eb70.jpeg", price: 1749, category: "Shirts & Tshirt" },
  { name: "Tissot_MotoGP", image: "https://cdn.cartpe.in/images/gallery_sm/68da9a60eddc10.jpeg", price: 1999, category: "Other" },
  { name: "Tissot_MotoGP", image: "https://cdn.cartpe.in/images/gallery_sm/68da9a4e70b600.jpeg", price: 1999, category: "Other" },
  { name: "Tissot_MotoGP", image: "https://cdn.cartpe.in/images/gallery_sm/68da9a1c4d42a0.jpeg", price: 1999, category: "Other" },
  { name: "Tissot_MotoGP", image: "https://cdn.cartpe.in/images/gallery_sm/68da9a0b86caa0.jpeg", price: 1999, category: "Other" },
  { name: "Tissot_MotoGP", image: "https://cdn.cartpe.in/images/gallery_sm/68da99b9961bc0.jpeg", price: 1999, category: "Other" },
  { name: "_Dolce_and_gabbana_5011", image: "https://cdn.cartpe.in/images/gallery_sm/68da983f43ca00.jpeg", price: 1099, category: "Other" },
  { name: "CARTIER_TANK", image: "https://cdn.cartpe.in/images/gallery_sm/68da978993ee60.jpeg", price: 1900, category: "Luxury Watch" },
  { name: "CARTIER_TANK", image: "https://cdn.cartpe.in/images/gallery_sm/68da96c56c42d0.jpeg", price: 1900, category: "Luxury Watch" },
  { name: "KARL LAGERFIELD.D WHITEPINK PREMIUM BAG WITH OG DUST BAG", image: "https://cdn.cartpe.in/images/gallery_sm/68da96bb6dbaa2.jpeg", price: 3400, category: "HandBags and Bag" },
  { name: "CARTIER_TANK", image: "https://cdn.cartpe.in/images/gallery_sm/68da95bb6c60d0.jpeg", price: 1900, category: "Luxury Watch" },
  { name: "CARTIER_TANK", image: "https://cdn.cartpe.in/images/gallery_sm/68da959356f8c0.jpeg", price: 1900, category: "Luxury Watch" },
  { name: "Emporio Arman_i Aviator Full Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da95164fca90.jpg", price: 2049, category: "Other" },
  { name: "CARTIE R TANK GOLD GREEN 2402", image: "https://cdn.cartpe.in/images/gallery_sm/68da951c59b850.jpeg", price: 1900, category: "Other" },
  { name: "CARTIE R TANK GOLD WHITE 2401", image: "https://cdn.cartpe.in/images/gallery_sm/68da94a9660e80.jpeg", price: 1900, category: "Other" },
  { name: "CARTIE R TANK COPPER BLACK 2400", image: "https://cdn.cartpe.in/images/gallery_sm/68da94052bbb80.jpeg", price: 1900, category: "Other" },
  { name: "CARTIE R TANK SILVER-BLACK 2399", image: "https://cdn.cartpe.in/images/gallery_sm/68da93d2017ac0.jpeg", price: 1900, category: "Other" },
  { name: "Emporio Arman_i Aviator Silver-Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68da935bd11100.jpg", price: 2049, category: "Other" },
  { name: "CARTIER_TANK_SILVER-WHITE", image: "https://cdn.cartpe.in/images/gallery_sm/68da9362d49000.jpeg", price: 1900, category: "Luxury Watch" },
  { name: "Emporio Arman_i Aviator Silver-White", image: "https://cdn.cartpe.in/images/gallery_sm/68da932d285990.jpg", price: 2049, category: "Other" },
  { name: "Tiziana Terenzi    GUMIN Anniversary Collection Extrait De Parfum", image: "https://cdn.cartpe.in/images/gallery_sm/68da930ff03d50.jpeg", price: 3700, category: "Perfumes" },
  { name: "Gucc i All-Black Luxury Shade 2044", image: "https://cdn.cartpe.in/images/gallery_sm/68da9232dc6630.jpeg", price: 1099, category: "Other" },
  { name: "Emporio Arman_i Aviator Silver-Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da9207ae2b50.jpg", price: 2049, category: "Other" },
  { name: "Karl Lagerfeld Brown Polo Premium Collar Neck T-shirt F2779-BR", image: "https://cdn.cartpe.in/images/gallery_sm/68da93aec10950.jpeg", price: 1699, category: "Shirts & Tshirt" },
  { name: "Karl Lagerfeld Grey Polo Premium Collar Neck T-shirt F2779-GY", image: "https://cdn.cartpe.in/images/gallery_sm/68da9237357b12.jpeg", price: 1699, category: "Shirts & Tshirt" },
  { name: "Karl Lagerfeld White Polo Premium Collar Neck T-shirt F2779-WH", image: "https://cdn.cartpe.in/images/gallery_sm/68da90efada390.jpeg", price: 1699, category: "Shirts & Tshirt" },
  { name: "Gucci_2514_gold_black", image: "https://cdn.cartpe.in/images/gallery_sm/68da8b6d151520.jpeg", price: 1100, category: "Other" },
  { name: "nikee  zoom Vomero Bred Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da87a3c4598.jpeg", price: 3600, category: "Other" },
  { name: "Roger Dubuis Automatic Open Heart", image: "https://cdn.cartpe.in/images/gallery_sm/68da878c01cf80.jpeg", price: 3199, category: "Luxury Watch" },
  { name: "Tisso t PRX Powermatic Automatic AAA", image: "https://cdn.cartpe.in/images/gallery_sm/68da86f0cd57f0.jpeg", price: 2499, category: "Luxury Watch" },
  { name: "Gucci_black_green_2051", image: "https://cdn.cartpe.in/images/gallery_sm/68da86dfde8df0.jpg", price: 1100, category: "Other" },
  { name: "Emporio Arman i Meccanico Automatic AAA", image: "https://cdn.cartpe.in/images/gallery_sm/68da8652f18660.jpeg", price: 2599, category: "Luxury Watch" },
  { name: "Rad o anatom premium semi auto", image: "https://cdn.cartpe.in/images/gallery_sm/68da8592f1b990.jpeg", price: 2399, category: "Other" },
  { name: "Role_x Oyster Perpetual Pepsi Edition Automatic TK-05", image: "https://cdn.cartpe.in/images/gallery_sm/68da84deb18860.jpeg", price: 2749, category: "Luxury Watch" },
  { name: "TISSOT_AUTO_ROSE-BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68da8467829590.jpeg", price: 2200, category: "Other" },
  { name: "Reebok Floatzig 1 Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da845f814cd0.jpeg", price: 3499, category: "Other" },
  { name: "Rad o anatom automatic", image: "https://cdn.cartpe.in/images/gallery_sm/68da8431141900.jpeg", price: 2399, category: "Luxury Watch" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da840ef23730.jpg", price: 2350, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da83e7135420.jpg", price: 2350, category: "Other" },
  { name: "Reebok Floatzig 1 White", image: "https://cdn.cartpe.in/images/gallery_sm/68da83d47ebf70.jpeg", price: 3499, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da83cd7a1650.jpg", price: 2350, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da83a770d330.jpg", price: 2350, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da83854e37b0.jpg", price: 2350, category: "Other" },
  { name: "Roger Dubuis Automatic Open Heart", image: "https://cdn.cartpe.in/images/gallery_sm/68da8371998080.jpeg", price: 3149, category: "Luxury Watch" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da8369aac9b0.jpg", price: 2350, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da8345174340.jpg", price: 2350, category: "Other" },
  { name: "Role x Label Nior", image: "https://cdn.cartpe.in/images/gallery_sm/68da8320a24560.jpg", price: 2350, category: "Other" },
  { name: "Dior_Diorama_Black_With_OG_Box_Dust_Bag_8046_Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da82b9f00bd0.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Emporio Arman i Diego Automatic AAA", image: "https://cdn.cartpe.in/images/gallery_sm/68da82824f1df0.jpeg", price: 2599, category: "Luxury Watch" },
  { name: "_Polo_Ralph_Lauren_Red_Parfum_100ML", image: "https://cdn.cartpe.in/images/gallery_sm/68da824da91c60.jpeg", price: 1198, category: "Shirts & Tshirt" },
  { name: "Emporio Arman i Diego Automatic AAA", image: "https://cdn.cartpe.in/images/gallery_sm/68da81fea3e1c0.jpeg", price: 2599, category: "Luxury Watch" },
  { name: "Emporio Arman i Meccanico Automatic AAA", image: "https://cdn.cartpe.in/images/gallery_sm/68da812b73b500.jpeg", price: 2799, category: "Luxury Watch" },
  { name: "Louis_Vuitton_WMNS_0331_Brown", image: "https://cdn.cartpe.in/images/gallery_sm/68da80642c9f10.jpeg", price: 1100, category: "Other" },
  { name: "Gucci_GG_Marmont_White_Shoulder_Bag_With_OG_Box_&_Dust_Bag_White_1733", image: "https://cdn.cartpe.in/images/gallery_sm/68da80393f66f0.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Marc_jacobs_1004_black_gold", image: "https://cdn.cartpe.in/images/gallery_sm/68da7da701b730.jpeg", price: 1100, category: "Other" },
  { name: "VICTORIA BOMBSHELL RED", image: "https://cdn.cartpe.in/images/gallery_sm/68da7be0ccd910.jpeg", price: 1300, category: "Other" },
  { name: "Gucc i Mens G timeless Premium Store article watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da7971be6f40.jpeg", price: 1899, category: "Luxury Watch" },
  { name: "Nikee P-6000 White Milk", image: "https://cdn.cartpe.in/images/gallery_sm/68da791c7a7f6.jpeg", price: 3500, category: "Other" },
  { name: "Gucc i Mens G timeless Premium Store article watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da78ab06e8a0.jpeg", price: 1899, category: "Luxury Watch" },
  { name: "new balancee Abzorb 2000 Dragon Berry", image: "https://cdn.cartpe.in/images/gallery_sm/68da781eb432d.jpeg", price: 3800, category: "Other" },
  { name: "Audemars_piguet royal Tourbillion", image: "https://cdn.cartpe.in/images/gallery_sm/68da78002fe620.jpg", price: 3549, category: "Other" },
  { name: "Diese_l 5 Bar Premium Watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da77eabb12f0.jpg", price: 1599, category: "Luxury Watch" },
  { name: "Gucci_GG_Marmont_Wine_Shoulder_Bag_With_OG_Box_&_Dust_Bag_Wine_1733", image: "https://cdn.cartpe.in/images/gallery_sm/68da77d640e2e0.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "MICHAEL.KORS BEIGE PINK BALLET CARMEN PREMIER HAND BAG WITH DUST BAG", image: "https://cdn.cartpe.in/images/gallery_sm/68da77c8532010.jpeg", price: 3200, category: "HandBags and Bag" },
  { name: "Audemars_piguet royal Tourbillion", image: "https://cdn.cartpe.in/images/gallery_sm/68da777db19ab0.jpg", price: 3549, category: "Other" },
  { name: "Gucci_GG_Marmont_Pink_Shoulder_Bag_With_OG_Box_&_Dust_Bag_Pink_1733", image: "https://cdn.cartpe.in/images/gallery_sm/68da777f2f6360.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Diese_l 5 Bar Premium Watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da774c927770.jpg", price: 1599, category: "Luxury Watch" },
  { name: "On Cloudmonster 2 Tempest Horizon", image: "https://cdn.cartpe.in/images/gallery_sm/68da76cd01154.jpeg", price: 3700, category: "Other" },
  { name: "Tisso_t 1853 Chemin De Tourelles", image: "https://cdn.cartpe.in/images/gallery_sm/68da76ab628930.jpg", price: 2349, category: "Other" },
  { name: "on cloudmonster Black white", image: "https://cdn.cartpe.in/images/gallery_sm/68da76410f9ee.jpeg", price: 3700, category: "Other" },
  { name: "Hublot Big Bang Calendar Leather Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da7628c75490.jpg", price: 2099, category: "Other" },
  { name: "Hublo t Japan Swiss Movement", image: "https://cdn.cartpe.in/images/gallery_sm/68da75e8ef1350.jpeg", price: 2200, category: "Other" },
  { name: "Hublo t Japan Swiss Movement", image: "https://cdn.cartpe.in/images/gallery_sm/68da75a00c5d30.jpeg", price: 2200, category: "Other" },
  { name: "Hublo t Japan Swiss Movement", image: "https://cdn.cartpe.in/images/gallery_sm/68da757a750110.jpeg", price: 2200, category: "Other" },
  { name: "Gucc i 25H Premium Mens Watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da756c39b280.jpeg", price: 2499, category: "Luxury Watch" },
  { name: "Gucci_GG_Marmont_Black_Shoulder_Bag_With_OG_Box_&_Dust_Bag_Black_1733", image: "https://cdn.cartpe.in/images/gallery_sm/68da752fcb3400.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Gucci_GG_Marmont_Apricot_Shoulder_Bag_With_OG_Box_&_Dust_Bag_Apricot_1733", image: "https://cdn.cartpe.in/images/gallery_sm/68da74ccc366d0.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "nikee Vomero phantom 5 Dust Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da74bf5a351.jpeg", price: 3500, category: "Other" },
  { name: "Hublo t Bigbang Premium Mens New Article", image: "https://cdn.cartpe.in/images/gallery_sm/68da73888f7eb0.jpeg", price: 1899, category: "Other" },
  { name: "Hublot Big Bang Calendar Leather Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da730ea50590.jpg", price: 2099, category: "Other" },
  { name: "Hublot Big Bang Calendar Leather Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da732ba17e90.jpg", price: 2099, category: "Other" },
  { name: "Hublot Big Bang Calendar Leather Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da72d6104300.jpg", price: 2099, category: "Other" },
  { name: "Tisso t 1853 Chronograph", image: "https://cdn.cartpe.in/images/gallery_sm/68da72b9615e00.jpg", price: 1899, category: "Luxury Watch" },
  { name: "Oakkley BLADE WATCH SILVER BLACK", image: "https://cdn.cartpe.in/images/gallery_sm/68da72b0cbbc20.jpg", price: 1899, category: "Luxury Watch" },
  { name: "Hublot Big Bang Classic Crocodile Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da7291d4ba60.jpg", price: 2099, category: "Other" },
  { name: "Hublot Big Bang Classic Crocodile Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da7270c29a40.jpg", price: 2099, category: "Other" },
  { name: "Hublot Big Bang Classic Crocodile Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da723e795c80.jpg", price: 2099, category: "Other" },
  { name: "Gucc i Mens Premium watch", image: "https://cdn.cartpe.in/images/gallery_sm/68da71fde281b0.jpeg", price: 2499, category: "Luxury Watch" },
  { name: "Hublot Big Bang Classic Crocodile Belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da71faca7670.jpg", price: 2099, category: "Other" },
  { name: "AUDEMERS PIGUE.T ROYAL OAK SWISS WATCH 012 blue", image: "https://cdn.cartpe.in/images/gallery_sm/68da71f8ac7120.jpg", price: 1749, category: "Luxury Watch" },
  { name: "Onitsuka Tiger Mexico 66 Slip on Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68da71d3256140.jpeg", price: 2999, category: "Other" },
  { name: "ROLE.X GMT MASTER GOLD Full Gold BLACK 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da71be02ae70.jpg", price: 1699, category: "Luxury Watch" },
  { name: "Role x Daydate Leather Premium", image: "https://cdn.cartpe.in/images/gallery_sm/68da7110900500.jpeg", price: 1649, category: "Other" },
  { name: "ADIDA.S YEEZY BOOST 350 HYPER SPACE SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/68da70ef0632a0.jpeg", price: 3200, category: "Other" },
  { name: "ROLE.X tiger golden WATCH 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da70d460c650.jpg", price: 1749, category: "Luxury Watch" },
  { name: "RAD.O CHRONOGRAPH CERAMIC LIMITED EDITION", image: "https://cdn.cartpe.in/images/gallery_sm/68da70920ddc00.jpg", price: 1899, category: "Luxury Watch" },
  { name: "NE.W BALANCE 530 SEA SALT ICE WINE", image: "https://cdn.cartpe.in/images/gallery_sm/68da7086d579a0.jpeg", price: 3199, category: "Other" },
  { name: "Role x Daydate Leather Premium", image: "https://cdn.cartpe.in/images/gallery_sm/68da7014160630.jpeg", price: 1649, category: "Other" },
  { name: "ADIDA.S YEEZY BOOST 350 SEA SAME SEMI UA", image: "https://cdn.cartpe.in/images/gallery_sm/68da7018456920.jpeg", price: 3200, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Brich Grass Green", image: "https://cdn.cartpe.in/images/gallery_sm/68da70118e3c20.jpeg", price: 2999, category: "Other" },
  { name: "new Balancee Unisex 740 Navy with White and Shadow Grey", image: "https://cdn.cartpe.in/images/gallery_sm/68da6fba3c1cd.jpeg", price: 3500, category: "Other" },
  { name: "ROLEEX SKYDWELLER silver GOLD green dial 003 stainless steel", image: "https://cdn.cartpe.in/images/gallery_sm/68da6f64016a90.jpg", price: 1749, category: "Shirts & Tshirt" },
  { name: "ROLE.X SKY DWELL STORE ARTICLE 003 gold white dial jubilee belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da6f353df360.jpeg", price: 1749, category: "Other" },
  { name: "ROLE.X SKY DWELL STORE ARTICLE 003 full gold green dial jubilee belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da6efe0a5760.jpeg", price: 1749, category: "Other" },
  { name: "Calvin Klei_n Black Silver", image: "https://cdn.cartpe.in/images/gallery_sm/68da6f094b33b0.jpeg", price: 1500, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH", image: "https://cdn.cartpe.in/images/gallery_sm/68da6eb41fb5f0.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH", image: "https://cdn.cartpe.in/images/gallery_sm/68da6e7747cca0.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH", image: "https://cdn.cartpe.in/images/gallery_sm/68da6e2abf4370.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH", image: "https://cdn.cartpe.in/images/gallery_sm/68da6e03250450.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6d635f77b0.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6d28a25930.jpeg", price: 1949, category: "Other" },
  { name: "VERSAC_E FULL PRINTED IMPORTED PREMIUM WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6d0734bd80.jpeg", price: 1949, category: "Other" },
  { name: "CARTIE_R SUNGLAS", image: "https://cdn.cartpe.in/images/gallery_sm/68da6cd7b2c430.jpeg", price: 1100, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Slipon Black Putty 1st leather", image: "https://cdn.cartpe.in/images/gallery_sm/68da6b6a6ebed0.jpeg", price: 3199, category: "Other" },
  { name: "Onitsuka Tiger Mexico 66 Slipon Brich Wood Crepe 1st leather", image: "https://cdn.cartpe.in/images/gallery_sm/68da6b0ec47590.jpeg", price: 3199, category: "Other" },
  { name: "Prada_plano_19Ws", image: "https://cdn.cartpe.in/images/gallery_sm/68da6abcc515f0.jpg", price: 1100, category: "Other" },
  { name: "CASABLANCA PREMIUM FULL PRINTED IMPORTED SHIRT WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6a3971a480.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "Cartier_3064_Gold_Blue_DC", image: "https://cdn.cartpe.in/images/gallery_sm/68da6a1a9d8f60.jpeg", price: 1100, category: "Luxury Watch" },
  { name: "CASABLANCA PREMIUM FULL PRINTED IMPORTED SHIRT WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6a0d1a19a0.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "CASABLANCA PREMIUM FULL PRINTED IMPORTED SHIRT WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da69c38c75b0.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "CASABLANCA PREMIUM FULL PRINTED IMPORTED SHIRT WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6991a4c3a0.jpeg", price: 1949, category: "Shirts & Tshirt" },
  { name: "BALMAI_N WHITE BLACK PREMIUM IMPORTED WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da6944576c30.jpeg", price: 1949, category: "Other" },
  { name: "BALMAI_N WHITE BLACK PREMIUM IMPORTED WITH BOX", image: "https://cdn.cartpe.in/images/gallery_sm/68da690d937130.jpeg", price: 1949, category: "Other" },
  { name: "louiss VuittonSkate Trainer Blue Monogram", image: "https://cdn.cartpe.in/images/gallery_sm/68da68e765212.jpeg", price: 3200, category: "Other" },
  { name: "Gucci_Super_Mini_Ophidia_Shoulder_Bag_Supreme_Canvas", image: "https://cdn.cartpe.in/images/gallery_sm/68da68649301e0.jpeg", price: 4499, category: "Shoes" },
  { name: "Coach_Mollie_25_Tote_Premium_With_OriginalBox_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da66fa28a020.jpeg", price: 3199, category: "HandBags and Bag" },
  { name: "Coach_Mollie_25_Tote_Premium_With_OriginalBox_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da66c8c8aa30.jpeg", price: 3199, category: "HandBags and Bag" },
  { name: "Nik.e Cortez TXT Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da6636d20410.jpeg", price: 3199, category: "Other" },
  { name: "Gucci_GG_Supreme_Vanity_Bag_With_OriginalBox_DustCover_LongBelt", image: "https://cdn.cartpe.in/images/gallery_sm/68da660176be30.jpeg", price: 3599, category: "HandBags and Bag" },
  { name: "Nik.e Cortez TXT White Blue", image: "https://cdn.cartpe.in/images/gallery_sm/68da65b3a7eaa0.jpeg", price: 3199, category: "Other" },
  { name: "Hoka Stinson  ATR 7 All Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da61cfb011a0.jpeg", price: 3699, category: "Other" },
  { name: "Hoka Stinson  ATR 7 White", image: "https://cdn.cartpe.in/images/gallery_sm/68da619bc0e020.jpeg", price: 3699, category: "Other" },
  { name: "Hoka Stinson  ATR 7 Grey Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da6117ea08a0.jpeg", price: 3699, category: "Other" },
  { name: "Hoka Stinson  ATR 7 Olive Green", image: "https://cdn.cartpe.in/images/gallery_sm/68da60dd7c8ac0.jpeg", price: 3699, category: "Other" },
  { name: "_Armani_Luigi_Silver_Black_13", image: "https://cdn.cartpe.in/images/gallery_sm/68da60766b3560.jpg", price: 2000, category: "Other" },
  { name: "Ysl Lou Lou Mini Premium Quilted Leather Bag With Original Double Box Packaging", image: "https://cdn.cartpe.in/images/gallery_sm/68da5f5040d3c0.jpeg", price: 4999, category: "HandBags and Bag" },
  { name: "Gucci_padlock_shoulder_bag_with_og_box_698", image: "https://cdn.cartpe.in/images/gallery_sm/68da5da380f260.jpeg", price: 3299, category: "HandBags and Bag" },
  { name: "Tag_heuer carrera caliber 17 Japan", image: "https://cdn.cartpe.in/images/gallery_sm/68da5d7f4758b0.jpeg", price: 3400, category: "Other" },
  { name: "Gucci_padlock_shoulder_bag_with_og_box_1735", image: "https://cdn.cartpe.in/images/gallery_sm/68da5d4612a080.jpeg", price: 3299, category: "HandBags and Bag" },
  { name: "Hublot Geneve", image: "https://cdn.cartpe.in/images/gallery_sm/68da5c500e0b70.jpg", price: 1599, category: "Other" },
  { name: "Hublot Bigbang Quartz Metal", image: "https://cdn.cartpe.in/images/gallery_sm/68da5c528cccf2.jpeg", price: 1699, category: "Luxury Watch" },
  { name: "Addidas samba black white men with keychain", image: "https://cdn.cartpe.in/images/gallery_sm/68da59f497c950.jpg", price: 2699, category: "Other" },
  { name: "Round_changeable_5201_gun_black", image: "https://cdn.cartpe.in/images/gallery_sm/68da5926c807f0.jpeg", price: 2000, category: "Other" },
  { name: "Michael_Kors_MK_Boston_Handbag_Sling_bag_1872)", image: "https://cdn.cartpe.in/images/gallery_sm/68da57b5021180.jpeg", price: 3099, category: "HandBags and Bag" },
  { name: "_Burberry_8258_for_her", image: "https://cdn.cartpe.in/images/gallery_sm/68da578406a170.jpeg", price: 1099, category: "Other" },
  { name: "Michael_kors_speedy_with_og_box_468", image: "https://cdn.cartpe.in/images/gallery_sm/68da5733a697d0.jpeg", price: 3199, category: "Other" },
  { name: "COACH_tabby_sig-cc-26_leather_shoulder_bag_with_box_893", image: "https://cdn.cartpe.in/images/gallery_sm/68da56af0a6290.jpeg", price: 3198, category: "HandBags and Bag" },
  { name: "Addidas samba black white women with keychain", image: "https://cdn.cartpe.in/images/gallery_sm/68da565b73b790.jpg", price: 2699, category: "Other" },
  { name: "Addidas Samba OG Wonder Quartz women", image: "https://cdn.cartpe.in/images/gallery_sm/68da55704cc530.jpg", price: 2699, category: "Luxury Watch" },
  { name: "Addidas Samba OG Wonder Quartz men", image: "https://cdn.cartpe.in/images/gallery_sm/68da54dc5a5955.jpg", price: 2699, category: "Luxury Watch" },
  { name: "Valentino_Garavani_VLogo_Signature_Flat_Leather_Sandals_Brown_With_OG_Box_&_Carry_Bag_1892_Brown", image: "https://cdn.cartpe.in/images/gallery_sm/68da541e408440.jpg", price: 3299, category: "HandBags and Bag" },
  { name: "Dior_Lady_D_Lite_Grey_With_Original_Box_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da5351d5ab40.jpeg", price: 3699, category: "Other" },
  { name: "Dior_Lady_D_Lite_Golden_With_Original_Box_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da531e6dc600.jpeg", price: 3699, category: "Other" },
  { name: "Dior_Lady_D_Lite_Black_With_Original_Box_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da52f8d6bf00.jpeg", price: 3699, category: "Other" },
  { name: "Dior_Lady_D_Lite_Maroon_With_Original_Box_DustCover", image: "https://cdn.cartpe.in/images/gallery_sm/68da52cf796be0.jpeg", price: 3699, category: "Other" },
  { name: "Gucci_GG_Marmont_Matelasse_Shoulder_Bag_With_OG_Box_&_Dust_Bag_(Pink-728)", image: "https://cdn.cartpe.in/images/gallery_sm/68da52a3e311c0.jpeg", price: 2599, category: "HandBags and Bag" },
  { name: "Hublot Geneve", image: "https://cdn.cartpe.in/images/gallery_sm/68da533db17900.jpg", price: 1599, category: "Other" },
  { name: "valentin_o garavani small vlogo oclock leather shoulder bag with box 512", image: "https://cdn.cartpe.in/images/gallery_sm/68da51eea0cab0.jpeg", price: 3498, category: "HandBags and Bag" },
  { name: "valentin_o garavani small vlogo oclock leather shoulder bag with box 513", image: "https://cdn.cartpe.in/images/gallery_sm/68da51af8a1180.jpeg", price: 3498, category: "HandBags and Bag" },
  { name: "Gucci_GG_Marmont_Matelasse_Shoulder_Bag_With_OG_Box_&_Dust_Bag_(Green-536)", image: "https://cdn.cartpe.in/images/gallery_sm/68da51782c6e10.jpeg", price: 2599, category: "HandBags and Bag" },
  { name: "valentin_o garavani small vlogo oclock leather shoulder bag with box 514", image: "https://cdn.cartpe.in/images/gallery_sm/68da51865e60b0.jpeg", price: 3498, category: "HandBags and Bag" },
  { name: "OFFER Miu miu alma satchel bag with og box and bill", image: "https://cdn.cartpe.in/images/gallery_sm/68da51834f6950.jpeg", price: 1999, category: "HandBags and Bag" },
  { name: "ROLEEX SKY DWELLWER yellow gold dial premium quality watch 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da5163125f10.jpg", price: 1749, category: "Luxury Watch" },
  { name: "ROLEEX SKY DWELLWER white with jubilee belt premium quality watch 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da511ae69e30.jpg", price: 1749, category: "Luxury Watch" },
  { name: "COAC.H BROWN PREMIUM HAND BAG WITH OG DUST BAG", image: "https://cdn.cartpe.in/images/gallery_sm/68da50d4c4f7a1.jpeg", price: 2800, category: "HandBags and Bag" },
  { name: "ROLEEX SKY DWELLWER champion gold dial two tone premium quality watch 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da50d0386240.jpg", price: 1749, category: "Luxury Watch" },
  { name: "ROLE.X SKY DWELL STORE ARTICLE 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da5063973350.jpeg", price: 1749, category: "Other" },
  { name: "ROLLEX SKY DWELLER BLUE PREMIUME 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da501d82a400.jpeg", price: 1749, category: "Other" },
  { name: "Hublot Geneve", image: "https://cdn.cartpe.in/images/gallery_sm/68da501cbf1fd0.jpg", price: 1599, category: "Other" },
  { name: "Hublot Geneve", image: "https://cdn.cartpe.in/images/gallery_sm/68da4ffd9716d0.jpg", price: 1599, category: "Other" },
  { name: "ROLE.X SKY DWELL STORE ARTICLE 003 black with stainless steel jubilee belt", image: "https://cdn.cartpe.in/images/gallery_sm/68da4ff21c8df0.jpeg", price: 1749, category: "Shirts & Tshirt" },
  { name: "Louis_Vuitton Epi Marellini Shoulder Bag With Double Og Box And Dust Bag Including Carry Bag (Black)", image: "https://cdn.cartpe.in/images/gallery_sm/68da4fe9dfed30.jpg", price: 3799, category: "HandBags and Bag" },
  { name: "Hublot Geneve", image: "https://cdn.cartpe.in/images/gallery_sm/68da4fd7798600.jpg", price: 1599, category: "Other" },
  { name: "Louis_Vuitton Epi Marellini Shoulder Bag With Double Og Box And Dust Bag Including Carry Bag (White)", image: "https://cdn.cartpe.in/images/gallery_sm/68da4fa039a2d0.jpg", price: 3799, category: "HandBags and Bag" },
  { name: "On CLOUDMONSTER WOMEN WHITELIMA", image: "https://cdn.cartpe.in/images/gallery_sm/68da4ee1ae3a6.jpeg", price: 3700, category: "Other" },
  { name: "Louis_Vuittion_Speedy_Nano_Denim_Bag_With_Box_Dustbag_Slingbelt_Bill", image: "https://cdn.cartpe.in/images/gallery_sm/68da4ed4d2ec20.jpg", price: 3099, category: "HandBags and Bag" },
  { name: "Cartier_wooden_black_3087", image: "https://cdn.cartpe.in/images/gallery_sm/68da4e5556a5c0.jpg", price: 1100, category: "Luxury Watch" },
  { name: "Role.x land dweller green dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4d4d6aa8a0.jpg", price: 1899, category: "Other" },
  { name: "Role.x land dweller gold black dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4d0ea31ab0.jpg", price: 1899, category: "Other" },
  { name: "Role.x land dweller rose gold blue limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4c73efbea0.jpg", price: 1899, category: "Other" },
  { name: "Role.x land dweller silver green dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4c23086f70.jpg", price: 1899, category: "Other" },
  { name: "Versace_4461_black", image: "https://cdn.cartpe.in/images/gallery_sm/68da4be8a96710.jpeg", price: 1100, category: "Other" },
  { name: "Role.x land dweller black dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4bd12a2070.jpg", price: 1899, category: "Other" },
  { name: "Role.x land dweller black dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da4b88392330.jpg", price: 1899, category: "Other" },
  { name: "Valentino_Garavani_VLogo_Signature_Flat_Leather_Sandals_Gold_With_OG_Box_&_Carry_Bag_1892_Gold", image: "https://cdn.cartpe.in/images/gallery_sm/68da4b78160e60.jpg", price: 3299, category: "HandBags and Bag" },
  { name: "Valentino_Garavani_VLogo_Signature_Flat_Leather_Sandals_Black_With_OG_Box_&_Carry_Bag_1892_Black", image: "https://cdn.cartpe.in/images/gallery_sm/68da4af580e070.jpg", price: 3299, category: "HandBags and Bag" },
  { name: "Role.x land dweller full gold white dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da48cf7f3fe0.jpg", price: 1899, category: "Other" },
  { name: "Gucci_Unisex_Shoulder_Bag_with_Logo_Black_Messenger_With_OG_Box_&_Dust_Bag_768391", image: "https://cdn.cartpe.in/images/gallery_sm/68da4894c5b910.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Patek phillipe moon working", image: "https://cdn.cartpe.in/images/gallery_sm/68da4841ee1df0.jpeg", price: 1749, category: "Luxury Watch" },
  { name: "Role.x land dweller rose gold pink dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da482867c2e0.jpg", price: 1899, category: "Other" },
  { name: "Patek phillipe moon working", image: "https://cdn.cartpe.in/images/gallery_sm/68da47e02e9620.jpeg", price: 1749, category: "Luxury Watch" },
  { name: "Role.x land dweller grey dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da47d0816f50.jpg", price: 1899, category: "Other" },
  { name: "Role.x land dweller champion gold yellow dial limited edition 003", image: "https://cdn.cartpe.in/images/gallery_sm/68da475f23e430.jpg", price: 1899, category: "Other" },
  { name: "Gucci_Unisex_Shoulder_Bag_with_Logo_Grey_Messenger_With_OG_Box_&_Dust_Bag_768391", image: "https://cdn.cartpe.in/images/gallery_sm/68da470100dd10.jpg", price: 3499, category: "HandBags and Bag" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J911", image: "https://cdn.cartpe.in/images/gallery_sm/68da45b24824f0.jpg", price: 1849, category: "Luxury Watch" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J907", image: "https://cdn.cartpe.in/images/gallery_sm/68da44e4b63c10.jpg", price: 1849, category: "Luxury Watch" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J903", image: "https://cdn.cartpe.in/images/gallery_sm/68da4452610d90.jpg", price: 1849, category: "Luxury Watch" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J904", image: "https://cdn.cartpe.in/images/gallery_sm/68da443167acb0.jpg", price: 1849, category: "Luxury Watch" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J908", image: "https://cdn.cartpe.in/images/gallery_sm/68da441fd97930.jpg", price: 1849, category: "Luxury Watch" },
  { name: "Role_x Oyster Perpetual Daytona Chronograph - J909", image: "https://cdn.cartpe.in/images/gallery_sm/68da43fa5af620.jpg", price: 1849, category: "Luxury Watch" },
 ];
const cleanedProducts = products.map(item => ({
  ...item,
  name: cleanName(item.name)
}));

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE) || 0;
const updatedProductList = cleanedProducts.map(product => ({
  ...product,
  price: product.price + priceIncrement
}));


const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
}

const ProductDetail = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(6);
  const [quantity, setQuantity] = useState(1);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  // For "View More" feature
  const [visibleCount, setVisibleCount] = useState(20);

  // Popup toast
  const [popup, setPopup] = useState("");

  // Modal for Buy Now confirmation
  const [showConfirm, setShowConfirm] = useState(false);

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  // const handleAddToCart = () => {
  //   if (!selectedProduct) return;

  //   const cartItem = {
  //     ...selectedProduct,
  //     size: Number(selectedSize),
  //     quantity: Number(quantity),
  //     image: selectedProduct.image,
  //   };

  //   addToCart(cartItem);
  //   console.log("Cart before add:", cart);
  //   console.log("Added product:", cartItem);
  //   showPopup(`${selectedProduct.name} added to Cart!`);
  // };

  // const handleBuyNow = () => {
  //   if (!selectedProduct) return;

  //   // Build the product object we want to send to checkout route
  //   const purchaseItem = {
  //     ...selectedProduct,
  //     size: Number(selectedSize),
  //     quantity: Number(quantity),
  //     image: selectedProduct.image,
  //   };

  //   // Save it to state so modal and confirmPurchase can use it
  //   setSelectedProduct(purchaseItem);
  //   setShowConfirm(true);
  // };

    const handleAddToCart = () => {
    if (!selectedProduct) return;
    const cartItem = {
      ...selectedProduct,
      size: Number(selectedSize),
      quantity: Number(quantity)
    };
    addToCart(cartItem);
    showPopup(`${selectedProduct.name} added to cart`);
  };

  // BUY NOW flow: create order on backend -> open Razorpay -> verify payment -> navigate
  const handleBuyNow = async () => {
    if (!selectedProduct) return showPopup('Select a product');

    // 1) ensure checkout script loaded
    const loaded = await loadRazorpayScript();
    if (!loaded) return showPopup('Razorpay SDK failed to load');

    try {
      const staticOrderData = {
  product: {
    name: "Michael Kors Eliza Tote 45",
    image: "MichaelTote45",
    price: 4500,
    category: "HandBags and Bag"
  },
  amount: 450000, // amount in paise (4500 * 100)
  razorpay_order_id: "order_ABC123XYZ",
  status: "ORDER_CREATED"
};

// Now your API call:
const res = await axios.post(`${API_BASE}/api/order/createOrder`, staticOrderData);


      const { orderId, amount, currency, key, dbOrderId } = res.data;

      // 3) open razorpay widget
      const options = {
        key: key || RAZORPAY_KEY, // test key
        amount: amount, // in paise
        currency: currency,
        name: selectedProduct.name,
        description: 'Purchase from MyStore',
        order_id: orderId,
        handler: async function (response) {
          // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            const verifyRes = await axios.post(`${API_BASE}/api/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId,
              user: {
                name: 'Guest', // or fetch from user context
                email: '', phone: ''
              }
            });

            if (verifyRes.data.success) {
              showPopup('Payment successful!');
              // navigate to customer-details with product & payment info
              navigate('/customer-details', {
                state: {
                  product: selectedProduct,
                  payment: {
                    orderId: verifyRes.data.orderId,
                    razorpay_payment_id: response.razorpay_payment_id
                  }
                }
              });
            } else {
              showPopup('Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            showPopup('Server verification error');
          }
        },
        modal: {
          ondismiss: function () {
            showPopup('Payment cancelled');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('create-order error', err);
      showPopup('Could not initiate payment');
    }
  };
  const confirmPurchase = () => {
    setShowConfirm(false);
    // Navigate to customer details with product details in state
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  

  return (
    <div className="product-section">
      {!selectedProduct ? (
        <>
          <h2>Your City's Best Deals Handpicked for you</h2>
          <div className="product-grid">
            {updatedProductList.slice(0, visibleCount).map((product, index) => (
              <div
                key={index}
                className="product-card"
                onClick={() => {
                  // keep the original product object here
                  setSelectedProduct(product);
                  // reset size/quantity defaults when opening details
                  setSelectedSize(6);
                  setQuantity(1);
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {visibleCount < updatedProductList.length && (
            <div className="view-more-container">
              <button
                className="btn-view-more"
                onClick={() => setVisibleCount(visibleCount + 20)}
              >
                View More
              </button>
            </div>
          )}
          {popup && <div className="popup">{popup}</div>}
        </>
      ) : (
        /* Product detail page */
        <div className="product-detail-expanded">
          <div className="product-detail-left">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="product-image-large"
            />
          </div>

          <div className="product-detail-right">
            <h2 className="product-name">{selectedProduct.name}</h2>
            <p className="product-price">₹{selectedProduct.price}</p>
            <p className="product-shipping">Shipping calculated at checkout.</p>

            <div className="product-extra-details">
              <h3>Product Details</h3>
              <ul>
                <li>✅ 100% Original & Premium Quality</li>
                <li>✅ Free Shipping on orders above ₹999</li>
                <li>✅ 7 Days Easy Exchange Policy</li>
              </ul>
            </div>

            <div className="product-options">
              <label htmlFor="size">Size:</label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {[6, 7, 8, 9, 10, 11].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-quantity">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="product-actions">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
<button onClick={handleBuyNow}>Buy Now1</button>
{popup && <div className="popup">{popup}</div>}
              <button
                className="btn-buy-now"
                onClick={() => {
                  // prepare selectedProduct as an enriched object for buy flow
                  const enriched = {
                    ...selectedProduct,
                    size: Number(selectedSize),
                    quantity: Number(quantity),
                    image: selectedProduct.image,
                  };
                  setSelectedProduct(enriched);
                  setShowConfirm(true);
                }}
              >
                Buy Now
              </button>

              <button
                className="btn-back"
                onClick={() => {
                  // go back to list view; if you want to preserve selectedProduct object
                  // from the list view, you'd need to store the raw product elsewhere.
                  setSelectedProduct(null);
                }}
              >
                ⬅ Back to Products
              </button>
            </div>

            {popup && <div className="popup">{popup}</div>}
          </div>
        </div>
      )}

      {/* Confirmation modal for Buy Now */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductDetail;