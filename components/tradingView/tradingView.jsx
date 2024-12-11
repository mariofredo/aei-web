'use client';
import React, {useEffect, useRef} from 'react';

function TradingViewWidget({stockCode}) {
  const containerRef = useRef();

  useEffect(() => {
    try {
      // Clear existing content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Create script element
      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        console.log('TradingView script loaded successfully.');
      };
      script.onerror = () => {
        console.error('Failed to load the TradingView script.');
      };
      script.innerHTML = JSON.stringify({
        symbols: [[`IDX:${stockCode}|ALL`]],
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: 'dark',
        autosize: false,
        showVolume: false,
        showMA: false,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
        fontSize: '10',
        noTimeScale: false,
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        chartType: 'area',
        maLineColor: '#2962FF',
        maLineWidth: 1,
        maLength: 9,
        headerFontSize: 'medium',
        lineWidth: 2,
        lineType: 0,
        dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
      });
      containerRef.current.appendChild(script);
    } catch (error) {
      console.log('Failed to load the TradingView widget:', error);
    }
  }, [stockCode]);

  return (
    <div className='tradingview-widget-container' ref={containerRef}>
      <div className='tradingview-widget-container__widget'></div>
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/'
          rel='noopener nofollow'
          target='_blank'
        >
          <span className='blue-text'>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default TradingViewWidget;
