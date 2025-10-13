import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enhanced web vitals reporting for Vercel Analytics
const reportToVercel = (metric: any) => {
  // This will be automatically handled by @vercel/analytics
  // but we can add custom reporting here if needed
  console.log('Web Vital:', metric);
};

export default reportWebVitals;
export { reportToVercel };
