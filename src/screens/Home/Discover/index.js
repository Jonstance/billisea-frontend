import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Discover.module.sass";
import { Range, getTrackBackground } from "react-range";
import Slider from "react-slick";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";

// data
import { bids } from "../../../mocks/bids";
import { useHistory } from "react-router";

const navLinks = ["All items", "Music", "Trading Cards", "Art", "Collectible", "Sport", "Utility" ];

const dateOptions = ["Recently Added", "Oldest"];
const priceOptions = ["Highest price", "The lowest price"];
const likesOptions = ["Most liked", "Least liked"];
const creatorOptions = ["Verified only", "All", "Most liked"];
const sortingOptions = [];
navLinks.map((x) => sortingOptions.push(x));

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);


const Discover = ({nfts}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(dateOptions[0]);
  const [price, setPrice] = useState(priceOptions[0]);
  const [likes, setLikes] = useState(likesOptions[0]);
  const [creator, setCreator] = useState(creatorOptions[0]);
  const [sorting, setSorting] = useState(sortingOptions[0]);

  const [values, setValues] = useState([0.0001]);

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState("");


  const [allNftData, setAllNFTData] = useState([])
  const [currentView, setCurrentView] = useState([])
  const [filteredNFTData, setFilteredNFTData] = useState([])


  const history = useHistory()

  useEffect(()=>{

      setAllNFTData(nfts)
      setFilteredNFTData(nfts)
      setCurrentView(nfts)

  },[])

  const STEP = 0.001;
  const MIN = 0.0001;
  const MAX = 1000;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 100000,
        settings: "unslick",
      },
    ],
  };




  const handleFilterByCategory = (index)=>{
    if(index === 0){
      setFilteredNFTData(allNftData)
      setCurrentView(allNftData)
    }
    else{
      const allNFTThatSatisfyFilter = allNftData.filter(eachNft=>{
        return eachNft.nftCategory.trim() === navLinks[index].trim()
      })
      setFilteredNFTData(allNFTThatSatisfyFilter)
      setCurrentView(allNFTThatSatisfyFilter)
    }
  }

  const filterPrice = (value)=>{
  setPrice(value)
  if(value === "Highest price"){
    const nftsByHighestPrice = filteredNFTData.sort((a,b)=>b.nftPrice-a.nftPrice)
    console.log(nftsByHighestPrice)
    setFilteredNFTData(nftsByHighestPrice)
    }
    else{
      const nftsByLowestPrice = filteredNFTData.sort((a,b)=>a.nftPrice-b.nftPrice)
      console.log(nftsByLowestPrice)
      setFilteredNFTData(nftsByLowestPrice)
    }
  }

  const filterPriceSlide = (value)=>{
    setValues(value)
    const filteredNFTByPrice = currentView.filter(eachNft=>{
      return eachNft.nftPrice < value
    })

    console.log(filteredNFTByPrice)
    setFilteredNFTData(filteredNFTByPrice)

  }

  // const filterDate = (value)=>{
  //   if(value === "Recently Added"){
  //     const nftsRecentlyAdded = filteredNFTData.sort((a,b)=>)
  //   }
  // }

  const searchKeyword = ()=>{
    const newItems =  currentView.filter(eachNft=>{
      return eachNft.nftName.includes(search)
    })
    console.log(newItems)
    setFilteredNFTData(newItems)
  }

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <h3 className={cn("h3", styles.title)}>Discover</h3>
        <div className={styles.top}>
          <div className={styles.dropdown}>
            <Dropdown
              className={styles.dropdown}
              value={date}
              setValue={setDate}
              options={dateOptions}
            />
          </div>
          <div className={styles.nav}>
            {navLinks.map((x, index) => (
              <button
                className={cn(styles.link, {
                  [styles.active]: index === activeIndex,
                })}
                onClick={() => handleFilterByCategory(index)}
                key={index}
              >
                {x}
              </button>
            ))}
          </div>
          <div className={cn("tablet-show", styles.dropdown)}>
            <Dropdown
              className={styles.dropdown}
              value={sorting}
              setValue={setSorting}
              options={sortingOptions}
            />
          </div>
          <button
            className={cn(styles.filter, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <div className={styles.text}>Filter</div>
            <div className={styles.toggle}>
              <Icon name="filter" size="18" />
              <Icon name="close" size="10" />
            </div>
          </button>
        </div>
        <div className={cn(styles.filters, { [styles.active]: visible })}>
          <div className={styles.sorting}>
            <div className={styles.cell}>
              <div className={styles.label}>Price</div>
              <Dropdown
                className={styles.dropdown}
                value={price}
                setValue={filterPrice}
                options={priceOptions}
              />
            </div>
            {/* <div className={styles.cell}>
              <div className={styles.label}>likes</div>
              <Dropdown
                className={styles.dropdown}
                value={likes}
                setValue={setLikes}
                options={likesOptions}
              />
            </div> */}
            {/* <div className={styles.cell}>
              <div className={styles.label}>creator</div>
              <Dropdown
                className={styles.dropdown}
                value={creator}
                setValue={setCreator}
                options={creatorOptions}
              />
            </div> */}
            <div className={styles.cell}>
              <div className={styles.label}>Price range</div>
              <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={filterPriceSlide}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "27px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "8px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#3772ff", "#E6E8EC"],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#3772ff",
                      border: "4px solid #FCFCFD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-33px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontFamily: "Poppins",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "#141416",
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                  </div>
                )}
              />
              <div className={styles.scale}>
                <div className={styles.number}> {MIN} BCAT</div>
                <div className={styles.number}>{MAX} BCAT</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.list}>
          <Slider
            className={cn("discover-slider", styles.slider)}
            {...settings}
          >
            {filteredNFTData.map((x, index) => (
              <Card className={styles.card} item={x} key={index} />
            ))}
          </Slider>
        </div>
        <div className={styles.btns}>
          <button 
         onClick={()=>history.push("/discover")} 
          className={cn("button-stroke button-small", styles.button)}>
            <span>Load more</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
